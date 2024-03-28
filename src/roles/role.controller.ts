import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RolesModel } from './dto/role.dto';
import { Roles } from './role.schema';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }
  @Get(':_id')
  findOne(@Param('_id') _id: string): Promise<Roles> {
    return this.roleService.findOneId(_id);
  }

  @Post()
  create(@Body() createRoleDto: RolesModel): Promise<Roles> {
    return this.roleService.create(createRoleDto);
  }

  @Put(':_id')
  update(@Param('_id') _id: string, @Body() updateRoleDto: RolesModel) {
    return this.roleService.update(_id, updateRoleDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string): Promise<void> {
    return this.roleService.remove(_id);
  }
}
