import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private Userservice: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.Userservice.findUser(username);

      const isValidPassword = await bcrypt.compare(pass, user?.password);

      if (!user) {
        throw new Error('no user found');
      }

      if (!isValidPassword) {
        throw new Error('incorrect password');
      }

      if (user && isValidPassword) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async loginWithJwt(user: any, res: any, req: any): Promise<any> {
    try {
      const payload = { username: user?._doc?.username, sub: user?._doc?._id };

      if (payload.username !== undefined && payload.sub !== undefined) {
        const accessToken = this.jwtService.sign(payload);

        res.cookie('jwtToken', accessToken, {
          secure: true,
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'None',
        });

        res.send({
          user: {
            ...user._doc,
            password: '',
            isAuthenticated: req.isAuthenticated(),
          },
          success: true,
          message: 'successfull logged in',
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
    res: any,
  ): Promise<any> {
    await this.Userservice.registerUser(username, email, password, res);
  }
}
