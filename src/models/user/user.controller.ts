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
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtGuard } from '../../auth/guard';
import { GetUser } from '../../auth/decorator';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUser('id') id: string) {
    return this.userService.getMe(id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
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
    @GetUser('id') requestId: string,
    @Param('id') id: string
  ) {
    if (requestId !== id) {
      throw new UnauthorizedException('No permission.');
    }

    return this.userService.uploadAvatar(avatar, requestId);
  }

  @Patch(':id')
  editUser(@GetUser('id') requestId: string, @Param('id') id: string, @Body() dto: EditUserDto) {
    if (requestId !== id) {
      throw new UnauthorizedException('No permission.');
    }

    return this.userService.editUser(requestId, dto);
  }
}
