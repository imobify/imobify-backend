import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';

@Module({
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
