import { Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { toNumber } from '../../../utils';

export class GetNearDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @Transform(({ value }) => toNumber(value, { default: 5000, min: 5000 }))
  @IsNumber()
  @IsOptional()
  distance?: number;
}
