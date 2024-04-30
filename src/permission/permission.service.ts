import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './permission.schema';
import { PermissionDTO } from './dto/permission.dto';
import { RoleService } from 'src/roles/role.service';
import { EventsDto } from 'src/events/dto/events.dto';
import { EventService } from 'src/events/events.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    private readonly roleService: RoleService,
    private readonly eventService: EventService,
  ) {}

  async findOneById(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async findOneByName(name: string): Promise<Permission> {
    const permission = await this.permissionModel.findOne({ name }).exec();
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }

  async create(
    createPermissionDto: PermissionDTO,
    user: any,
  ): Promise<Permission> {
    const rolesKey = createPermissionDto.roles;
    const roles = await this.roleService.validateRoles(rolesKey);
    if (!roles) {
      throw new NotFoundException('No roles found for the provided role IDs');
    }
    const createdPermission = new this.permissionModel({
      ...createPermissionDto,
      roles: rolesKey,
    });
    const savedPermission = await createdPermission.save();

    const eventData: EventsDto = {
      type: 'permission_created',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: savedPermission.toObject(),
      old_data: null,
    };
    await this.eventService.create(eventData);

    return savedPermission;
  }

  async update(
    id: string,
    user: any,
    updatePermissionDto: PermissionDTO,
  ): Promise<Permission> {
    const existingPermission = await this.permissionModel.findById(id).exec();
    if (!existingPermission) {
      throw new NotFoundException('Permission not found');
    }
    const oldData = { ...existingPermission.toObject() };
    existingPermission.name = updatePermissionDto.name;
    existingPermission.roles = updatePermissionDto.roles;
    const updatedPermission = await existingPermission.save();
    const eventData: EventsDto = {
      type: 'permission_updated',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: updatedPermission.toObject(),
      old_data: oldData,
    };
    await this.eventService.create(eventData);

    return updatedPermission;
  }

  async remove(id: string, user: any): Promise<void> {
    const deletedPermission = await this.permissionModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPermission) {
      throw new NotFoundException('Permission not found');
    }

    const eventData: EventsDto = {
      type: 'permission_deleted',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: null,
      old_data: deletedPermission.toObject(),
    };
    await this.eventService.create(eventData);
  }
}
