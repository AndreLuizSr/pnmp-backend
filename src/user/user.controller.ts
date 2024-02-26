import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UserModel } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string): Promise<User> {
    return this.userService.findOneByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: UserModel): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UserModel) {
    return this.userService.update(email, updateUserDto);
  }

  @Delete(':email')
  remove(@Param('email') email: string): Promise<void> {
    return this.userService.remove(email);
  }
}
