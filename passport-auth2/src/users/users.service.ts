import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { Error } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: any) {}

  async registerUser(
    username: string,
    email: string,
    password: string,
    res: any,
  ): Promise<any> {
    const user = await this.usersModel.findOne({ username: username });
    try {
      if (user) {
        res.send({ message: 'user already exists', success: false });
        return new Error('user already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.usersModel({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res.send({ message: 'user created proceed to login', success: true });
    } catch (error) {
      console.log(error.message);
    }
  }

  async findUser(username: string): Promise<User | null> {
    try {
      const user = await this.usersModel.findOne({ username });
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }
}
