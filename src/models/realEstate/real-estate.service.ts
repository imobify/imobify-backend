import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ImageService } from '../../shared/image/image.service';
import { QueryDto } from '../shared/dto';
import { CreateRealEstateDto, EditRealEstateDto, GetNearDto, SearchRealEstateDto, UpdatePhotosDto } from './dto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthUser } from '../../auth/dto';

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
      skip: query.cursor ? 1 : 0,
      cursor: {
        id: query.cursor ? query.cursor : user.realEstate[0]?.id ? user.realEstate[0]?.id : 0,
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

  async searchRealEstates(query: SearchRealEstateDto) {
    const realEstates = await this.prisma.$queryRaw`
      SELECT
        r.id,
        r.title,
        (
          SELECT
            rp."photoUrl"
          FROM
            real_estate_photo rp
          WHERE
            rp."realEstate_id" = r.id
          ORDER BY
            rp.id DESC
          LIMIT 1
        )
      FROM
        real_estate r
      ORDER BY
        SIMILARITY(${query.q}, search) DESC
      LIMIT 5
    `;

    return realEstates;
  }

  async getRealEstateById(id: number) {
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

    if (!realEstate) {
      throw new NotFoundException('Could not find a real estate with provided ID.');
    }

    const coordinates = await realEstate.coords;

    return { ...realEstate, coordinates };
  }

  async createRealEstate(dto: CreateRealEstateDto, user: AuthUser) {
    try {
      const realEstate = await this.prisma.$queryRaw`
          INSERT INTO real_estate (title, description, address, area, selling_value, renting_value, tax_value, coordinates, "isActive", owner_id, "updatedAt", search)
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
            NOW(),
            ${dto.title + dto.address}
          ) 
          RETURNING id
        `;

      if (dto.images) {
        await this.createRealEstatePhotos(dto.images, realEstate[0].id);
      }

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
        throw new BadRequestException('Invalid request.');
      } else {
        throw error;
      }
    }
  }

  async editRealEstate(dto: EditRealEstateDto, user: AuthUser, realEstateId: number) {
    const existingRealEstate = await this.prisma.realEstate.findUnique({
      where: {
        id: realEstateId,
      },
    });

    if (!existingRealEstate) {
      throw new NotFoundException('Could not find real estate with provided ID.');
    }

    if (existingRealEstate.owner_id !== user.id) {
      throw new UnauthorizedException('No permission to edit this real estate.');
    }

    if (dto.longitude && dto.latitude) {
      await this.prisma.$queryRaw`
        UPDATE real_estate
        SET coordinates = ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)
        WHERE id = ${existingRealEstate.id} AND owner_id = ${user.id}
      `;

      delete dto.longitude;
      delete dto.latitude;
    }

    if (dto.deletedPhotos !== null && dto.deletedPhotos !== undefined && dto.deletedPhotos.length) {
      const imagePromises = dto.deletedPhotos.map(photo => {
        return this.imageService.deleteFileFromCloudinary(photo);
      });

      await Promise.all(imagePromises);

      await this.prisma.realEstatePhoto.deleteMany({
        where: {
          photoPublicId: {
            in: dto.deletedPhotos,
          },
        },
      });

      delete dto.deletedPhotos;
    }

    if (dto.images !== null && dto.images !== undefined && dto.images.length) {
      await this.createRealEstatePhotos(dto.images, existingRealEstate.id);

      delete dto.images;
    }

    const photos = await this.prisma.realEstatePhoto.findMany({
      where: {
        realEstate_id: existingRealEstate.id,
      },
      select: {
        photoUrl: true,
      },
    });

    if (dto.title) {
      if (dto.address) {
        dto.search = `${dto.title}${dto.address}`;
      }

      dto.search = `${dto.title}${existingRealEstate.address}`;
    } else if (dto.address) {
      dto.search = `${existingRealEstate.title}${dto.address}`;
    }

    const updatedRealEstate = await this.prisma.postgis.realEstate.update({
      data: {
        ...dto,
      },
      where: {
        id: existingRealEstate.id,
        owner_id: user.id,
      },
    });

    const coordinates = await updatedRealEstate.coords;

    return { ...updatedRealEstate, photos, coordinates };
  }

  async updateRealEstatePhotos(dto: UpdatePhotosDto, user: AuthUser, realEstateId: number) {
    const existingRealEstate = await this.prisma.realEstate.findUnique({
      where: {
        id: realEstateId,
      },
    });

    if (!existingRealEstate) {
      throw new NotFoundException('Could not find real estate with provided ID.');
    }

    if (existingRealEstate.owner_id !== user.id) {
      throw new UnauthorizedException('No permission to edit this real estate.');
    }

    if (dto.deletedPhotos.length) {
      const imagePromises = dto.deletedPhotos.map(photo => {
        return this.imageService.deleteFileFromCloudinary(photo);
      });

      await Promise.all(imagePromises);

      await this.prisma.realEstatePhoto.deleteMany({
        where: {
          photoPublicId: {
            in: dto.deletedPhotos,
          },
        },
      });
    }

    if (dto.images.length) {
      await this.createRealEstatePhotos(dto.images, existingRealEstate.id);
    }

    return this.prisma.realEstatePhoto.findMany({
      where: {
        realEstate_id: existingRealEstate.id,
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
    const imagePromises = images.map(image => {
      return this.imageService.uploadFileToCloudinary(image);
    });

    const responses = await Promise.all(imagePromises);

    const input = responses.map(res => {
      return {
        photoUrl: res.secure_url,
        photoPublicId: res.public_id,
        realEstate_id: realEstateId,
      };
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

    const imagePromises = realEstatePhotos.map(photo => {
      return this.imageService.deleteFileFromCloudinary(photo.photoPublicId);
    });

    await Promise.all(imagePromises);
  }
}
