import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UserModel } from './dto/user.dto';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: UserModel): Promise<User> {
    const hashedPassword = hashSync(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async update(email: string, updateUserDto: UserModel): Promise<User> {
    const existingUser = await this.userModel
      .findOneAndUpdate({ email }, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return existingUser;
  }

  async remove(email: string): Promise<void> {
    const result = await this.userModel.deleteOne({ email }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
