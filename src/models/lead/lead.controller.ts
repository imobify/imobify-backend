import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { QueryDto } from '../shared/dto';
import { GetUser } from '../../auth/decorator';
import { AuthUser } from '../../auth/dto';
import { JwtGuard } from '../../auth/guard';
import { TypeIdCheckInterceptor } from '../shared/interceptors';
import { CreateLeadDto } from './dto';

@UseGuards(JwtGuard)
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  getPaginatedLeads(@GetUser() user: AuthUser, @Query() query: QueryDto) {
    return this.leadService.getPaginated(query, user);
  }

  @Post()
  @UseInterceptors(new TypeIdCheckInterceptor(1))
  createLead(@GetUser() user: AuthUser, @Body() dto: CreateLeadDto) {
    return this.leadService.createLead(user, dto.realEstate_id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseInterceptors(new TypeIdCheckInterceptor(1))
  deleteLead(@GetUser() user: AuthUser, @Param('id') leadId: number) {
    return this.leadService.deleteLead(user, leadId);
  }
}
