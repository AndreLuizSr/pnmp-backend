import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from './permission.schema';
import { PermissionModel } from './dto/permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }
  @Get(':name')
  findOne(@Param('name') name: string): Promise<Permission> {
    return this.permissionService.findOneByOne(name);
  }

  @Post()
  create(@Body() createRoleDto: PermissionModel): Promise<Permission> {
    return this.permissionService.create(createRoleDto);
  }

  @Put(':name')
  update(
    @Param('name') name: string,
    @Body() updatePermissionDto: PermissionModel,
  ) {
    return this.permissionService.update(name, updatePermissionDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string): Promise<void> {
    return this.permissionService.remove(name);
  }
}
