import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { User } from './user.schema';
import { UserModel } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Post()
  async create(@Body() createUserDto: UserModel): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':email')
  async update(
    @Param('email') email: string,
    @Body() updateUserDto: UserModel,
  ): Promise<User> {
    return this.userService.update(email, updateUserDto);
  }

  @Delete(':email')
  async remove(@Param('email') email: string): Promise<void> {
    return this.userService.remove(email);
  }
}
