import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLeadDto {
  @IsNumber()
  @IsNotEmpty()
  realEstate_id: number;
}
