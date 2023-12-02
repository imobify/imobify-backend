import { PartialType } from '@nestjs/mapped-types';
import { CreateRealEstateDto } from './create-real-estate.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class EditRealEstateDto extends PartialType(CreateRealEstateDto) {
  @IsOptional()
  @IsArray()
  deletedPhotos?: string[];

  @IsOptional()
  @IsString()
  search?: string;
}
