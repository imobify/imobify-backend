import { User } from '@prisma/client';

export type OutputDto = Promise<(Omit<User, 'hash'> & { access_token: string }) | null>;
