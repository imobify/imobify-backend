import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
export class CreateRealEstateDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  area: number;

  @Type(() => Number)
  @IsNumber()
  @Min(100)
  @IsOptional()
  selling_value?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(100)
  @IsOptional()
  renting_value?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  tax_value?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsString()
  @IsNotEmpty()
  isActive: string;

  @IsFiles()
  @MaxFileSize(1024 * 1024 * 10, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  images: MemoryStoredFile[];
}
