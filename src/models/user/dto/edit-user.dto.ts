import { IsOptional, IsString, IsEmail, IsNumberString, MinLength, MaxLength, Matches } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsNumberString()
  @MinLength(11)
  @MaxLength(14)
  document: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
  password: string;
}
