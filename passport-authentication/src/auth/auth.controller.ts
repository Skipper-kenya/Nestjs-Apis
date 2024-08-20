import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport.guard';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    return await this.authService.loginWithJwt(req.user);
  }

  @Post('register')
  async register(@Request() req: any): Promise<any> {
    const { username, password } = req.body;
    await this.authService.registerUser(username, password);
  }

  //protected routes implementation
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req): Promise<any> {
    return req.user;
  }
}
