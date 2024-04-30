import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { User } from './user.schema';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':_id')
  async findOne(@Param('_id') _id: string): Promise<User> {
    return this.userService.findById(_id);
  }

  @Post()
  async create(@Body() createUserDto: UserDTO): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':_id')
  async update(
    @Param('_id') _id: string,
    @Body() updateUserDto: UserDTO,
  ): Promise<User> {
    return this.userService.update(_id, updateUserDto);
  }

  @Delete(':_id')
  async remove(@Param('_id') _id: string): Promise<void> {
    return this.userService.remove(_id);
  }
}
