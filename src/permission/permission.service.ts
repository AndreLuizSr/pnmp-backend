import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './permission.schema';
import { Model } from 'mongoose';
import { PermissionDTO } from './dto/permission.dto';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionDTO: Model<Permission>,
    private readonly rolesService: RoleService,
  ) {}

  async findOneById(id: string): Promise<Permission> {
    const permission = await this.permissionDTO.findById(id).exec();
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
  async findOneByName(name: string): Promise<Permission> {
    const permission = await this.permissionDTO.findOne({ name }).exec();
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionDTO.find().exec();
  }

  async create(createPermissionDto: PermissionDTO): Promise<Permission> {
    const rolesKey = createPermissionDto.roles;
    const roles = await this.rolesService.validateRoles(rolesKey);
    if (roles === false) {
      throw new NotFoundException('No roles found for the provided role IDs');
    }
    const createdPermission = new this.permissionDTO({
      ...createPermissionDto,
      roles: rolesKey,
    });
    return createdPermission.save();
  }

  async update(
    id: string,
    updatePermissionDto: PermissionDTO,
  ): Promise<Permission> {
    const existingPermission = await this.findOneById(id);
    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }
    existingPermission.name = updatePermissionDto.name;
    existingPermission.roles = updatePermissionDto.roles;
    const updatedPermission = await existingPermission.save();
    return updatedPermission;
  }

  async remove(id: string): Promise<void> {
    const result = await this.permissionDTO.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Permission not found');
    }
  }
}
