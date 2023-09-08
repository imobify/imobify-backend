import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { QueryDto } from '../shared/dto';
import { CreateRealEstateDto, EditRealEstateDto, GetNearDto, UpdatePhotosDto } from './dto';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import { FormDataRequest } from 'nestjs-form-data';

@UseGuards(JwtGuard)
@Controller('real-estate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Get()
  getPaginatedRealEstate(@GetUser('id') userId: string, @Query() query: QueryDto) {
    return this.realEstateService.getPaginatedRealEstates(query, userId);
  }

  @Get('near')
  getNearbyRealEstates(@Query() query: GetNearDto) {
    return this.realEstateService.getNear(query);
  }

  @Get(':id')
  getRealEstateById(@Param('id', ParseIntPipe) id: number) {
    return this.realEstateService.getRealEstateById(id);
  }

  @Post()
  @FormDataRequest()
  createRealEstate(@GetUser('id') userId: string, @Body() dto: CreateRealEstateDto) {
    return this.realEstateService.createRealEstate(dto, userId);
  }

  @Patch(':id')
  @FormDataRequest()
  editRealEstate(
    @Param('id', ParseIntPipe) realEstateId: number,
    @GetUser('id') userId: string,
    @Body() dto: EditRealEstateDto
  ) {
    return this.realEstateService.editRealEstate(dto, userId, realEstateId);
  }

  @Patch(':id/photos')
  @FormDataRequest()
  updateRealEstatePhotos(
    @Param('id', ParseIntPipe) realEstateId: number,
    @GetUser('id') userId: string,
    @Body() dto: UpdatePhotosDto
  ) {
    return this.realEstateService.updateRealEstatePhotos(dto, userId, realEstateId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteRealEstate(@Param('id', ParseIntPipe) realEstateId: number, @GetUser('id') userId: string) {
    return this.realEstateService.deleteRealEstate(userId, realEstateId);
  }
}
