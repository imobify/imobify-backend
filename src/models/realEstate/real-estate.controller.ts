import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { QueryDto } from '../shared/dto';
import { CreateRealEstateDto } from './dto';

// @UseGuards(JwtGuard)
@Controller('real-estate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Get()
  getPaginatedRealEstate(@Query() query: QueryDto) {
    return this.realEstateService.getPaginatedRealEstate(query);
  }

  @Post()
  createListing(@Body() dto: CreateRealEstateDto) {
    return this.realEstateService.createRealEstate(dto);
  }
}
