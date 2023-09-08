import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ImageService } from '../../shared/image/image.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EditUserDto, UploadAvatarDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private imageService: ImageService) {}

  async getMe(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    delete user.hash;
    return user;
  }

  async editUser(id: string, dto: EditUserDto) {
    if (dto.password) {
      const hash = await argon.hash(dto.password);

      delete dto.password;

      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          hash,
          ...dto,
        },
      });

      delete user.hash;
      return user;
    } else {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });

      delete user.hash;
      return user;
    }
  }

  async uploadAvatar(dto: UploadAvatarDto, userId: string) {
    const imageResponse = await this.imageService.uploadFileToCloudinary(dto.avatar);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.avatar_public_id) {
      await this.imageService.deleteFileFromCloudinary(user.avatar_public_id);
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar_url: imageResponse.secure_url,
        avatar_public_id: imageResponse.public_id,
      },
    });

    return { avatar_url: user.avatar_url };
  }
}
