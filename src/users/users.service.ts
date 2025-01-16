import { Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).lean().exec();
    return user as User;
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').lean().exec();
  }
}
