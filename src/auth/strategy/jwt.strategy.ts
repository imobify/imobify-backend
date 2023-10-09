import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AuthUser } from '../dto';

type Payload = {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        favorites: {
          select: {
            id: true,
          },
          take: 1,
          orderBy: {
            id: 'asc',
          },
        },
        leads: {
          select: {
            id: true,
          },
          take: 1,
          orderBy: {
            id: 'asc',
          },
        },
        realEstate: {
          select: {
            id: true,
          },
          take: 1,
          orderBy: {
            id: 'asc',
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }

    return user as AuthUser;
  }
}
