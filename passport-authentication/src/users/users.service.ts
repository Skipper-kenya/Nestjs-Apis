import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { Error } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel) {}

  async registerUser(username: string, password: string): Promise<any> {
    const user = await this.usersModel.findOne({ username: username });
    try {
      if (user) {
        return new Error('user already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.usersModel({
        username,
        password: hashedPassword,
      });
      await newUser.save();
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
