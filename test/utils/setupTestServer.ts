import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/shared/prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;

export const setupTestServer = async (): Promise<void> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  await app.init();
  await app.listen(3333);

  prisma = app.get(PrismaService);

  await prisma.clearDb();
  await prisma.seedDb();

  pactum.request.setBaseUrl('http://localhost:3333');
};

export const closeTestServer = async (): Promise<void> => {
  if (app) {
    await app.close();
  }
};
