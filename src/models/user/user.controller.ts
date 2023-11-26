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
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../../auth/guard';
import { GetUser } from '../../auth/decorator';
import { EditUserDto } from './dto';
import { CheckUserIdInterceptor } from '../../auth/interceptor';
import { AuthUser } from '../../auth/dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@GetUser('id') userId: string, @UploadedFile() avatar: Express.Multer.File) {
    return this.userService.uploadAvatar(avatar, userId);
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
