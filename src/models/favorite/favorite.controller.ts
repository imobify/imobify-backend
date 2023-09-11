import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { GetUser } from '../../auth/decorator';
import { AuthUser } from '../../auth/dto';
import { QueryDto } from '../shared/dto';
import { TypeIdCheckInterceptor } from '../shared/interceptors';
import { CreateFavoriteDto } from './dto';
import { JwtGuard } from '../../auth/guard';

@UseGuards(JwtGuard)
@UseInterceptors(new TypeIdCheckInterceptor(1))
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  getPaginatedFavorites(@GetUser() user: AuthUser, @Query() query: QueryDto) {
    return this.favoriteService.getPaginated(query, user);
  }

  @Post()
  createFavorite(@GetUser() user: AuthUser, @Body() dto: CreateFavoriteDto) {
    return this.favoriteService.createFavorite(user, dto.realEstate_id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteFavorite(@GetUser() user: AuthUser, @Param('id') favoriteId: number) {
    return this.favoriteService.deleteFavorite(user, favoriteId);
  }
}
