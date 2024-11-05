import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport.guard';
import { JwtAuthGuard } from './jwt.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Response() res: any): Promise<any> {
    return await this.authService.loginWithJwt(req.user, res, req);
  }

  @Post('register')
  async register(@Request() req: any, @Response() res: any): Promise<any> {
    const { username, email, password } = req.body;
    await this.authService.registerUser(username, email, password, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logoutUser(@Response() res: any): Promise<any> {
    try {
      // res.cookie('jwtToken', '', { maxAge: new Date(0) });
      res.cookie('jwtToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(0),
      });
      return res.status(200).json({ message: 'Logged out', success: true });
    } catch (error) {
      console.log(error.message);
    }
  }

  //protected routes implementation
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req: any): Promise<any> {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  // @UseFilters(JwtAuthExceptionFilter) // Apply filter here
  @Get('isUserAuthenticated')
  async isUserAuthenticated(@Request() req: any): Promise<any> {
    const user = await this.userService.findUser(req?.user.user);
    user.password = '';

    const us = {
      _id: req.user.userId,
      username: user?.username,
      email: user?.email,
      isAuthenticated: req?.isAuthenticated(),
    };

    return us;
  }
}
