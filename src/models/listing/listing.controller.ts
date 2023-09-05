import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ListingService } from './listing.service';
import { JwtGuard } from '../../auth/guard';
import { QueryDto } from '../shared/dto';
import { CreateListingDto } from './dto';

// @UseGuards(JwtGuard)
@Controller('listings')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get()
  getListings(@Query() query: QueryDto) {
    return this.listingService.getListings(query);
  }

  @Post()
  createListing(@Body() dto: CreateListingDto) {
    console.log({ dto });
  }
}
