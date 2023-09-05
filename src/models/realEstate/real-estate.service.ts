import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { QueryDto } from '../shared/dto';
import { CreateRealEstateDto } from './dto';

@Injectable()
export class RealEstateService {
  constructor(private prisma: PrismaService) {}

  async getPaginatedRealEstate(query: QueryDto) {
    const { take, cursor } = query;

    const realEstates = this.prisma.realEstate.findMany({
      take,
      skip: 0,
      where: {
        id: {
          gt: cursor,
        },
      },
    });
  }

  async createRealEstate(dto: CreateRealEstateDto) {
    console.log({ dto });
  }
}
