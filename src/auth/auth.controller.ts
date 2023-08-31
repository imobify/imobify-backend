import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signIn(dto);
  }
}
