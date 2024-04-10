import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './permission.schema';
import { Model } from 'mongoose';
import { PermissionModel } from './dto/permission.dto';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    private readonly rolesService: RoleService,
  ) {}

  async findOneByOne(name: string): Promise<Permission> {
    const permission = await this.permissionModel.findOne({ name }).exec();
    if (!permission) {
      throw new NotFoundException('permission not found');
    }
    return permission;
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }

  async create(createPermissionDto: PermissionModel): Promise<Permission> {
    const rolesKey = createPermissionDto.roles;
    const roles = await this.rolesService.validateRoles(rolesKey);
    if (roles === false) {
      throw new NotFoundException('No roles found for the provided role IDs');
    }
    const createdPermission = new this.permissionModel({
      ...createPermissionDto,
      roles: rolesKey,
    });
    return createdPermission.save();
  }

  async update(
    name: string,
    updatePermissionDto: PermissionModel,
  ): Promise<Permission> {
    const existingPermission = await this.findOneByOne(name);
    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }
    existingPermission.name = updatePermissionDto.name;
    existingPermission.roles = updatePermissionDto.roles;
    const updatedPermission = await existingPermission.save();
    return updatedPermission;
  }

  async remove(name: string): Promise<void> {
    const result = await this.permissionModel.deleteOne({ name }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Permission not found');
    }
  }
}
