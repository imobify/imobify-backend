import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Coordinates } from './types';

function getExtendedClient(baseClient: PrismaService) {
  return baseClient.$extends({
    model: {
      realEstate: {
        async findManyNear(coords: Coordinates, maxDistance = 5000) {
          return await baseClient.$queryRaw`
            SELECT
              id,
              ST_X(coordinates::geometry) AS longitude,
              ST_Y(coordinates::geometry) AS latitude,
              ROUND(
                ST_Distance(
                  coordinates::geography,
                  ST_SetSRID(ST_MakePoint(${coords.longitude}, ${coords.latitude}), 4326)::geography
              ) / 1000) AS distance
            FROM
              real_estate
            WHERE
              ST_DWithin(
                coordinates,
                ST_SetSRID(ST_MakePoint(${coords.longitude}, ${coords.latitude}), 4326),
                ${maxDistance}
              )
              AND "isActive" IS TRUE
            ORDER BY distance ASC;
          `;
        },
      },
    },
    result: {
      realEstate: {
        coords: {
          needs: { id: true },
          async compute(data): Promise<Coordinates> {
            return (
              await baseClient.$queryRaw<Coordinates[]>`
                SELECT
                  ST_X(coordinates::geometry) AS longitude,
                  ST_Y(coordinates::geometry) AS latitude
                FROM
                  real_estate
                WHERE id = ${data.id}
                LIMIT 1
              `
            )[0];
          },
        },
      },
    },
  });
}

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

    this.postgis = getExtendedClient(this);
  }

  readonly postgis: ReturnType<typeof getExtendedClient>;

  async getCoordinates(data) {
    return this.$queryRaw<Coordinates[]>`
      SELECT
        ST_X(coordinates::geometry) AS longitude,
        ST_Y(coordinates::geometry) AS latitude
      FROM
        real_estate
      WHERE id = ${data.id}
      LIMIT 1
    `;
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
