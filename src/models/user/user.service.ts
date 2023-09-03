import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ImageService } from '../../shared/image/image.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private imageService: ImageService) {}

  async getMe(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      delete user.hash;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async editUser(id: string, dto: EditUserDto) {
    try {
      if (dto.password) {
        const hash = await argon.hash(dto.password);
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
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(image: Express.Multer.File, userId: string) {
    try {
      const imageResponse = await this.imageService.uploadFileToCloudinary(image);

      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar_url: imageResponse.secure_url,
        },
      });

      return { avatar_url: user.avatar_url };
    } catch (error) {
      throw error;
    }
  }
}
