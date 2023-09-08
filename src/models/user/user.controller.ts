import { Body, Controller, Get, Post, UseGuards, UseInterceptors, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../../auth/guard';
import { GetUser } from '../../auth/decorator';
import { EditUserDto, UploadAvatarDto } from './dto';
import { CheckUserIdInterceptor } from '../../auth/interceptor';
import { FormDataRequest } from 'nestjs-form-data';

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
  editUser(@GetUser('id') id: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(id, dto);
  }
}
