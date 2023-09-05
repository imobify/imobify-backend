import { Module } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { RealEstateController } from './real-estate.controller';

@Module({
  controllers: [RealEstateController],
  providers: [RealEstateService],
})
export class RealEstateModule {}
