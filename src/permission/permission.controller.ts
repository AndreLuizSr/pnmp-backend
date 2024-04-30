import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionService } from './permission.service';
import { Permission } from './permission.schema';
import { PermissionDTO } from './dto/permission.dto';

@Controller('permission')
@UseGuards(AuthGuard('jwt'))
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string): Promise<Permission> {
    return this.permissionService.findOneById(_id);
  }

  @Post()
  create(
    @Body() createPermissionDto: PermissionDTO,
    @Req() req: any,
  ): Promise<Permission> {
    const user = req.user;
    return this.permissionService.create(createPermissionDto, user);
  }

  @Put(':_id')
  update(
    @Param('_id') _id: string,
    @Body() updatePermissionDto: PermissionDTO,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.permissionService.update(_id, user, updatePermissionDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string, @Req() req: any): Promise<void> {
    const user = req.user;
    return this.permissionService.remove(_id, user);
  }
}
