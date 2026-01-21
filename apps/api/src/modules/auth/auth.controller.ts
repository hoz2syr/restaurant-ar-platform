import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // Protected route to verify guard and token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    // Passport attaches the validated payload to req.user
    return { user: req.user };
  }
}
