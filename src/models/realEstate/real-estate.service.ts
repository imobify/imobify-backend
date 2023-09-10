import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ImageService } from '../../shared/image/image.service';
import { QueryDto } from '../shared/dto';
import { CreateRealEstateDto, EditRealEstateDto, GetNearDto, UpdatePhotosDto } from './dto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtGuard } from '../../auth/guard';
import { AuthUser } from '../../auth/dto';

@UseGuards(JwtGuard)
@Injectable()
export class RealEstateService {
  constructor(private prisma: PrismaService, private imageService: ImageService) {}

  async getNear(query: GetNearDto) {
    const { longitude, latitude, distance } = query;

    const nearbyRealEstates = await this.prisma.postgis.realEstate.findManyNear({ longitude, latitude }, distance);

    return nearbyRealEstates;
  }

  async getPaginatedRealEstates(query: QueryDto, user: AuthUser) {
    const realEstates = await this.prisma.realEstate.findMany({
      take: query.take ? query.take : 20,
      skip: 0,
      cursor: {
        id: query.cursor ? query.cursor : user.realEstate[0].id ? user.realEstate[0]?.id : 1,
      },
      select: {
        id: true,
        title: true,
        isActive: true,
        photos: {
          select: {
            photoUrl: true,
          },
          take: 1,
          orderBy: {
            id: 'asc',
          },
        },
        _count: {
          select: {
            leads: true,
          },
        },
      },
      where: {
        owner_id: user.id,
      },
    });

    return realEstates;
  }

  async getRealEstateById(id: number) {
    try {
      const realEstate = await this.prisma.postgis.realEstate.findUnique({
        where: {
          id: id,
        },
        include: {
          photos: {
            select: {
              photoUrl: true,
              photoPublicId: true,
            },
          },
          owner: {
            select: {
              name: true,
              avatar_url: true,
            },
          },
        },
      });

      const coordinates = await realEstate.coords;

      return { ...realEstate, coordinates };
    } catch (error) {
      console.log(error);

      throw new NotFoundException('Could not find a real estate with provided ID.');
    }
  }

  async createRealEstate(dto: CreateRealEstateDto, user: AuthUser) {
    try {
      const realEstate = await this.prisma.$queryRaw`
          INSERT INTO real_estate (title, description, address, area, selling_value, renting_value, tax_value, coordinates, "isActive", owner_id, "updatedAt")
          VALUES (
            ${dto.title}, 
            ${dto.description}, 
            ${dto.address}, 
            ${dto.area}, 
            ${dto.selling_value || dto.selling_value === 0 ? dto.selling_value : Prisma.sql`NULL`}, 
            ${dto.renting_value || dto.renting_value === 0 ? dto.renting_value : Prisma.sql`NULL`}, 
            ${dto.tax_value || dto.tax_value === 0 ? dto.tax_value : Prisma.sql`NULL`}, 
            ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326), 
            CAST(${dto.isActive} AS BOOLEAN), 
            ${user.id}, 
            NOW()
          ) 
          RETURNING id
        `;

      await this.createRealEstatePhotos(dto.images, realEstate[0].id);

      const realEstateModel = await this.prisma.postgis.realEstate.findUnique({
        where: {
          id: realEstate[0].id,
        },
        include: {
          photos: {
            select: {
              photoUrl: true,
            },
          },
          owner: {
            select: {
              name: true,
            },
          },
        },
      });

      const coordinates = await realEstateModel.coords;

      return { ...realEstateModel, coordinates };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid request. Check /api/docs for reference.');
      } else {
        throw error;
      }
    }
  }

  async editRealEstate(dto: EditRealEstateDto, user: AuthUser, realEstateId: number) {
    if (!user || !user.realEstate.filter(r => r.id === realEstateId).length) {
      throw new UnauthorizedException('No permission to edit this real estate.');
    }

    if (dto.longitude && dto.latitude) {
      await this.prisma.$queryRaw`
        UPDATE real_estate
        SET coordinates = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)
        WHERE id = ${realEstateId} AND owner_id = ${user.id}
      `;
    }

    const realEstate = await this.prisma.postgis.realEstate.update({
      data: {
        ...dto,
      },
      where: {
        id: realEstateId,
        owner_id: user.id,
      },
    });

    const coordinates = await realEstate.coords;

    return { ...realEstate, coordinates };
  }

  async updateRealEstatePhotos(dto: UpdatePhotosDto, user: AuthUser, realEstateId: number) {
    const realEstate = await this.prisma.realEstate.findUnique({
      where: {
        id: realEstateId,
        owner_id: user.id,
      },
    });

    if (!realEstate) {
      throw new ForbiddenException('No permission.');
    }

    if (dto.deletedPhotos.length) {
      for await (const photo of dto.deletedPhotos) {
        await this.imageService.deleteFileFromCloudinary(photo);
      }

      await this.prisma.realEstatePhoto.deleteMany({
        where: {
          photoPublicId: {
            in: dto.deletedPhotos,
          },
        },
      });
    }

    if (dto.images.length) {
      await this.createRealEstatePhotos(dto.images, realEstateId);
    }

    return this.prisma.realEstatePhoto.findMany({
      where: {
        realEstate_id: realEstateId,
      },
      select: {
        photoUrl: true,
      },
    });
  }

  async deleteRealEstate(userId: string, realEstateId: number) {
    const realEstate = await this.prisma.realEstate.findUnique({
      where: {
        id: realEstateId,
      },
    });

    if (!realEstate) throw new NotFoundException('Could not find a real estate with provided ID.');

    if (userId !== realEstate.owner_id) throw new ForbiddenException('No permission.');

    await this.deleteRealEstatePhotos(realEstate.id);

    return this.prisma.realEstate.delete({
      where: {
        id: realEstateId,
      },
    });
  }

  async createRealEstatePhotos(images: MemoryStoredFile[], realEstateId: number) {
    const cloudinaryData = [];

    for await (const image of images) {
      const imageResponse = await this.imageService.uploadFileToCloudinary(image);
      cloudinaryData.push({ photoUrl: imageResponse.secure_url, photoPublicId: imageResponse.public_id });
    }

    const input = cloudinaryData.map(data => {
      return { realEstate_id: realEstateId, ...data };
    });

    return this.prisma.realEstatePhoto.createMany({
      data: input,
    });
  }

  async deleteRealEstatePhotos(id: number) {
    const realEstatePhotos = await this.prisma.realEstatePhoto.findMany({
      where: {
        realEstate_id: id,
      },
      select: {
        photoPublicId: true,
      },
    });

    for await (const photo of realEstatePhotos) {
      await this.imageService.deleteFileFromCloudinary(photo.photoPublicId);
    }
  }
}
