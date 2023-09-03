import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './shared/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
