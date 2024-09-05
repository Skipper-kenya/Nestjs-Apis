import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //user registration

  async registerUser(userDetails: any) {
    try {
      const { email, username, password } = userDetails;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        email,
        username,
        password: hashedPassword,
      });

      await newUser.save();
    } catch (error) {
      console.log(error.message);
    }
  }
}
