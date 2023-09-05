import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  author_id: string;

  @IsString()
  @IsNotEmpty()
  realEstate_id: string;
}
