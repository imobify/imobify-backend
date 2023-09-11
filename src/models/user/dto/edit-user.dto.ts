import { OmitType, PartialType } from '@nestjs/mapped-types';
import { SignupDto } from '../../../auth/dto';
import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class EditUserDto extends PartialType(OmitType(SignupDto, ['type_id'] as const)) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
  previous_password?: string;
}
