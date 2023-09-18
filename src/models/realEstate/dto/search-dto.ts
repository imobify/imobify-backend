import { IsNotEmpty, IsString } from 'class-validator';

export class SearchRealEstateDto {
  @IsNotEmpty()
  @IsString()
  q: string;
}
