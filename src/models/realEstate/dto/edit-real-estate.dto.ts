import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class EditRealEstateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  area?: number;

  @IsNumber()
  @IsOptional()
  selling_value?: number;

  @IsNumber()
  @IsOptional()
  renting_value?: number;

  @IsNumber()
  @IsOptional()
  tax_value?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
