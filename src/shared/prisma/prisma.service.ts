import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  clearDb() {
    return this.$transaction([
      this.favorite.deleteMany(),
      this.lead.deleteMany(),
      this.realEstatePhoto.deleteMany(),
      this.realEstate.deleteMany(),
      this.user.deleteMany(),
      this.userType.deleteMany(),
    ]);
  }

  seedDb() {
    return this.$transaction([
      this.userType.upsert({
        where: {
          type: 'Cliente',
        },
        update: {},
        create: {
          id: 1,
          type: 'Cliente',
        },
      }),
      this.userType.upsert({
        where: {
          type: 'Anunciante',
        },
        update: {},
        create: {
          id: 2,
          type: 'Anunciante',
        },
      }),
    ]);
  }
}
