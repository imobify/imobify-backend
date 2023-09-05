import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { JwtGuard } from '../../auth/guard';
import { QueryDto } from '../shared/dto';
import { CreateListingDto } from './dto';

// @UseGuards(JwtGuard)
@Controller('real-estate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Get()
  getPaginatedRealEstate(@Query() query: QueryDto) {
    return this.realEstateService.getPaginatedRealEstate(query);
  }

  @Post()
  createListing(@Body() dto: CreateListingDto) {
    console.log({ dto });
  }
}
