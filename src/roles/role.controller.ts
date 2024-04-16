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
    const keys = Object.keys(RolesEnum);
    const data = [];

    keys.forEach((key) => {
      data.push({ key: key, value: RolesEnum[key] });
    });

    return data;
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    const valid = this.roleService.validateRole(key);
    return { key: key, value: RolesEnum[key] };
  }
}
