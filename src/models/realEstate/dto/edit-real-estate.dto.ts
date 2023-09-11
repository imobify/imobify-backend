import { PartialType } from '@nestjs/mapped-types';
import { CreateRealEstateDto } from './create-real-estate.dto';
import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class EditRealEstateDto extends PartialType(CreateRealEstateDto) {
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  deletedPhotos?: string[];
}
