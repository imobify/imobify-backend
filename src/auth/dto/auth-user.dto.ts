import { User } from '@prisma/client';

export type AuthUser = {
  realEstate: {
    id: number;
  }[];
  leads: {
    id: number;
  }[];
  favorites: {
    id: number;
  }[];
} & Omit<User, 'hash'>;
