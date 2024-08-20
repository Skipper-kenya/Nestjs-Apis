import { Injectable } from '@nestjs/common';
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

      if (user && isValidPassword) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      console.log(error.message);
    }
  }

  async loginWithJwt(user: any): Promise<any> {
    try {
      const payload = { username: user?._doc.username, sub: user?._doc._id };

      const accessToken = await this.jwtService.sign(payload);

      return { accessToken, ...user._doc, password: '' };
    } catch (error) {
      console.log(error.message);
    }
  }

  async registerUser(username: string, password: string): Promise<any> {
    await this.Userservice.registerUser(username, password);
  }
}
