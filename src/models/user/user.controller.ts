import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtGuard } from '../../auth/guard';
import { GetUser } from '../../auth/decorator';
import { EditUserDto } from './dto';
import { CheckUserIdInterceptor } from '../../auth/interceptor';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUser('id') id: string) {
    return this.userService.getMe(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'), CheckUserIdInterceptor)
  uploadImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
        ],
      })
    )
    avatar: Express.Multer.File,
    @GetUser('id') id: string
  ) {
    return this.userService.uploadAvatar(avatar, id);
  }

  @Patch(':id')
  @UseInterceptors(CheckUserIdInterceptor)
  editUser(@GetUser('id') id: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(id, dto);
  }
}
