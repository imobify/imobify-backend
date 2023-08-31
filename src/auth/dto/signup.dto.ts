import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(11)
  @MaxLength(14)
  document: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @IsNotEmpty()
  type_id: number;
}
