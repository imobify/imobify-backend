import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ImageService } from '../../shared/image/image.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { EditUserDto } from './dto';
import { AuthUser } from '../../auth/dto';

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

  async editUser(user: AuthUser, dto: EditUserDto) {
    if (dto.password) {
      if (!dto.previous_password) {
        throw new ForbiddenException('Cannot update password without validating previous password.');
      }

      const passwordMatch = await argon.verify(user.hash, dto.previous_password);

      if (!passwordMatch) {
        throw new BadRequestException('Previous password does not match.');
      }

      const hash = await argon.hash(dto.password);

      delete dto.password;
      delete dto.previous_password;

      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          hash,
          ...dto,
        },
      });

      delete updatedUser.hash;
      return updatedUser;
    } else {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...dto,
        },
      });

      delete updatedUser.hash;
      return updatedUser;
    }
  }

  async uploadAvatar(avatar: Express.Multer.File, userId: string) {
    const imageResponse = await this.imageService.uploadFileToCloudinary(avatar);

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.avatar_public_id) {
      await this.imageService.deleteFileFromCloudinary(user.avatar_public_id);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar_url: imageResponse.secure_url,
        avatar_public_id: imageResponse.public_id,
      },
    });

    return { avatar_url: updatedUser.avatar_url };
  }

  async deleteUser(user: AuthUser) {
    await this.imageService.deleteFileFromCloudinary(user.avatar_public_id);

    return this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
}
