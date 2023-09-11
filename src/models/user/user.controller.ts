import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../../auth/guard';
import { GetUser } from '../../auth/decorator';
import { EditUserDto, UploadAvatarDto } from './dto';
import { CheckUserIdInterceptor } from '../../auth/interceptor';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthUser } from '../../auth/dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUser('id') id: string) {
    return this.userService.getMe(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(CheckUserIdInterceptor)
  @FormDataRequest()
  uploadAvatar(@GetUser('id') userId: string, dto: UploadAvatarDto) {
    return this.userService.uploadAvatar(dto, userId);
  }

  @Patch(':id')
  @UseInterceptors(CheckUserIdInterceptor)
  editUser(@GetUser() user: AuthUser, @Body() dto: EditUserDto) {
    return this.userService.editUser(user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseInterceptors(CheckUserIdInterceptor)
  deleteUser(@GetUser() user: AuthUser) {
    return this.userService.deleteUser(user);
  }
}
