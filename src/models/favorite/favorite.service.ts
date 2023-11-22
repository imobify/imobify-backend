import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { QueryDto } from '../shared/dto';
import { AuthUser } from '../../auth/dto';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaginated(query: QueryDto, user: AuthUser) {
    const favorites = await this.prisma.favorite.findMany({
      take: query.take ? query.take : 20,
      skip: query.cursor ? 1 : 0,
      cursor: {
        id: query.cursor ? query.cursor : user.favorites[0]?.id ? user.favorites[0]?.id : 0,
      },
      select: {
        id: true,
        realEstate: {
          select: {
            id: true,
            title: true,
            address: true,
            photos: {
              select: {
                photoUrl: true,
              },
              take: 1,
              orderBy: {
                id: 'asc',
              },
            },
          },
        },
      },
      where: {
        author_id: user.id,
        realEstate: {
          isActive: true,
        },
      },
    });

    return favorites;
  }

  async createFavorite(user: AuthUser, realEstateId: number) {
    const realEstate = await this.prisma.realEstate.findUnique({
      where: {
        id: realEstateId,
      },
    });

    if (!realEstate) {
      throw new NotFoundException('Could not find a real estate with provided ID.');
    }

    const existingFavorite = await this.prisma.favorite.findFirst({
      where: {
        author_id: user.id,
        realEstate_id: realEstate.id,
      },
    });

    if (existingFavorite) {
      throw new ForbiddenException('Real estate is already in favorites.');
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        author_id: user.id,
        realEstate_id: realEstate.id,
      },
    });

    return favorite;
  }

  async deleteFavorite(user: AuthUser, favoriteId: number) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        id: favoriteId,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Could not find a listing with provided ID.');
    }

    if (user.id !== favorite.author_id) {
      throw new ForbiddenException('No permission.');
    }

    return this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });
  }
}
