import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsUUID,
  IsNotEmptyObject,
  IsDefined,
} from 'class-validator';

class Coordinates {
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;
}
export class CreateRealEstateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  area: number;

  @IsNumber()
  @IsNotEmpty()
  selling_value: number;

  @IsNumber()
  @IsNotEmpty()
  renting_value: number;

  @IsNumber()
  @IsOptional()
  tax_value?: number;

  @IsNotEmptyObject()
  @IsDefined()
  @ValidateNested()
  coordinates: Coordinates;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsUUID()
  @IsNotEmpty()
  owner_id: string;
}
