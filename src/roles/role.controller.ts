import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RolesEnum } from './roles.enum';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.getAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    const valid = this.roleService.validateRole(key);
    return { key: key, value: RolesEnum[key] };
  }
}
