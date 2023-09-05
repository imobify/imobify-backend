import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { QueryDto } from '../shared/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListingService {
  constructor(private readonly prisma: PrismaService) {}

  getListings(query: QueryDto) {
    const { take, cursor } = query;

    return this.prisma.realEstateListing.findMany({
      take,
      skip: 0,
      where: {
        id: {
          gt: cursor,
        },
      },
    });
  }
}
