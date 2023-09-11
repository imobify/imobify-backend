import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './shared/image/image.module';
import { UserModule } from './models/user/user.module';
import { RealEstateModule } from './models/realEstate/real-estate.module';
import { LeadModule } from './models/lead/lead.module';
import { FavoriteModule } from './models/favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ImageModule,
    UserModule,
    RealEstateModule,
    LeadModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
