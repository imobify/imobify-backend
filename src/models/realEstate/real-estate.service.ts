import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { QueryDto } from '../shared/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RealEstateService {
  constructor(private readonly prisma: PrismaService) {}

  getPaginatedRealEstate(query: QueryDto) {
    const { take, cursor } = query;

    return this.prisma.realEstate.findMany({
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
