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
  UseInterceptors,
} from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { QueryDto } from '../shared/dto';
import { CreateRealEstateDto, EditRealEstateDto, GetNearDto, UpdatePhotosDto } from './dto';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthUser } from '../../auth/dto';
import { TypeIdCheckInterceptor } from '../shared/interceptors';

@UseGuards(JwtGuard)
@Controller('real-estate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Get()
  @UseInterceptors(new TypeIdCheckInterceptor(2))
  getPaginatedRealEstate(@GetUser() user, @Query() query: QueryDto) {
    return this.realEstateService.getPaginatedRealEstates(query, user);
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
  @UseInterceptors(new TypeIdCheckInterceptor(2))
  @FormDataRequest()
  createRealEstate(@GetUser() user: AuthUser, @Body() dto: CreateRealEstateDto) {
    return this.realEstateService.createRealEstate(dto, user);
  }

  @Patch(':id')
  @UseInterceptors(new TypeIdCheckInterceptor(2))
  @FormDataRequest()
  editRealEstate(@Param('id', ParseIntPipe) realEstateId: number, @GetUser() user, @Body() dto: EditRealEstateDto) {
    return this.realEstateService.editRealEstate(dto, user, realEstateId);
  }

  @Patch(':id/photos')
  @UseInterceptors(new TypeIdCheckInterceptor(2))
  @FormDataRequest()
  updateRealEstatePhotos(
    @Param('id', ParseIntPipe) realEstateId: number,
    @GetUser() user: AuthUser,
    @Body() dto: UpdatePhotosDto
  ) {
    return this.realEstateService.updateRealEstatePhotos(dto, user, realEstateId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseInterceptors(new TypeIdCheckInterceptor(2))
  deleteRealEstate(@Param('id', ParseIntPipe) realEstateId: number, @GetUser('id') userId: string) {
    return this.realEstateService.deleteRealEstate(userId, realEstateId);
  }
}
