import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { toNumber } from '../../../utils';

export class QueryDto {
  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @IsNumber()
  @IsOptional()
  take?: number;

  @Transform(({ value }) => toNumber(value, { min: 1 }))
  @IsNumber()
  @IsOptional()
  cursor?: number;
}
