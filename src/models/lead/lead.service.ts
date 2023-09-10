import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { QueryDto } from '../shared/dto';
import { AuthUser } from '../../auth/dto';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  async getPaginated(query: QueryDto, user: AuthUser) {
    if (user.type_id === 1) {
      if (!user.leads.length) {
        return [];
      }

      const leads = await this.prisma.lead.findMany({
        take: query.take ? query.take : 20,
        skip: 0,
        cursor: {
          id: query.cursor ? query.cursor : user.leads[0].id,
        },
        include: {
          realEstate: {
            select: {
              id: true,
              title: true,
              photos: {
                select: {
                  photoUrl: true,
                },
              },
            },
          },
        },
        where: {
          author_id: user.id,
        },
      });

      return leads;
    } else if (user.type_id === 2) {
      const userLeads = await this.prisma.lead.findMany({
        where: {
          realEstate: {
            owner_id: user.id,
          },
        },
      });

      if (!userLeads.length) {
        return [];
      }

      const leads = await this.prisma.lead.findMany({
        take: query.take ? query.take : 20,
        skip: 0,
        include: {
          author: {
            select: {
              name: true,
              email: true,
              phone: true,
              avatar_url: true,
            },
          },
        },
        where: {
          id: {
            gte: query.cursor ? query.cursor : 1,
          },
          realEstate: {
            owner_id: user.id,
          },
        },
      });

      return leads;
    }
  }

  async createLead(user: AuthUser, realEstateId: number) {
    const realEstate = await this.prisma.realEstate.findUnique({
      where: {
        id: realEstateId,
      },
    });

    if (!realEstate) {
      throw new NotFoundException('Could not find a lead with provided ID.');
    }

    const existingLead = await this.prisma.lead.findFirst({
      where: {
        author_id: user.id,
        realEstate_id: realEstate.id,
      },
    });

    if (existingLead) {
      throw new ForbiddenException('User already is a lead on this real estate.');
    }

    const lead = await this.prisma.lead.create({
      data: {
        author_id: user.id,
        realEstate_id: realEstate.id,
      },
    });

    return lead;
  }

  async deleteLead(user: AuthUser, leadId: number) {
    const lead = await this.prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    if (!lead) {
      throw new NotFoundException('Could not find a lead with provided ID.');
    }

    if (user.id !== lead.author_id) {
      throw new ForbiddenException('No permission.');
    }

    return this.prisma.lead.delete({
      where: {
        id: lead.id,
      },
    });
  }
}
