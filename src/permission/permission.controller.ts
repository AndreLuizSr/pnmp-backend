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
import { PermissionDTO } from './dto/permission.dto';

@Controller('permission')
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
  create(@Body() createRoleDto: PermissionDTO): Promise<Permission> {
    return this.permissionService.create(createRoleDto);
  }

  @Put(':_id')
  update(
    @Param('_id') _id: string,
    @Body() updatePermissionDto: PermissionDTO,
  ) {
    return this.permissionService.update(_id, updatePermissionDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string): Promise<void> {
    return this.permissionService.remove(_id);
  }
}
