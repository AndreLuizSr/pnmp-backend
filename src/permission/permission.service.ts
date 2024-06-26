import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './permission.schema';
import { PermissionDTO } from './dto/permission.dto';
import { RoleService } from 'src/roles/role.service';
import { EventsDto } from 'src/events/dto/events.dto';
import { EventService } from 'src/events/events.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    private readonly roleService: RoleService,
    private readonly eventService: EventService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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

  async findAll(user: any): Promise<Permission[]> {
    if (!user) {
      throw new NotFoundException('Not found');
    }
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

    await this.eventService.createEvent(
      'permission_created',
      user.id,
      user,
      savedPermission.toObject(),
    );

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

    await this.userService.syncUserRoles(updatedPermission.name);

    await this.eventService.createEvent(
      'permission_updated',
      user.id,
      user,
      updatedPermission.toObject(),
      oldData,
    );

    return updatedPermission;
  }

  async remove(id: string, user: any): Promise<void> {
    const deletedPermission = await this.permissionModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPermission) {
      throw new NotFoundException('Permission not found');
    }

    await this.eventService.createEvent(
      'permission_deleted',
      user.id,
      user,
      null,
      deletedPermission.toObject(),
    );
    
  }
}
