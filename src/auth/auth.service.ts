import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../shared/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type OutputDto = Promise<(Omit<User, 'hash'> & { access_token: string }) | null>;

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signUp(dto: SignupDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          hash,
          document: dto.document,
          email: dto.email,
          name: dto.name,
          type_id: dto.type_id,
        },
      });

      return this.signToken(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already in use!');
        }

        throw error;
      }
    }
  }

  async signIn(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect credentials!');
    }

    const passwordMatch = await argon.verify(user.hash, dto.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect credentials!');
    }

    return this.signToken(user);
  }

  async signToken(user: User): OutputDto {
    delete user.hash;

    const payload = { ...user };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
      ...user,
    };
  }
}
