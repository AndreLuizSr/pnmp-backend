import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Req,
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
  async create(@Body() dto: UserDTO, @Req() req: any): Promise<User> {
    const user = req.user;
    return this.userService.create(dto, user);
  }

  @Put(':_id')
  async update(
    @Param('_id') _id: string,
    @Body() dto: UserDTO,
    @Req() req: any,
  ): Promise<User> {
    const user = req.user;
    return this.userService.update(_id, dto, user);
  }

  @Delete(':_id')
  async remove(@Param('_id') _id: string, @Req() req: any): Promise<User> {
    const user = req.user;
    return this.userService.delete(_id, user);
  }
}
