import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashSync } from 'bcrypt';
import { User } from './user.schema';
import { UserDTO } from './dto/user.dto';
import { RoleService } from 'src/roles/role.service';
import { PermissionService } from 'src/permission/permission.service';
import { EventsDto } from 'src/events/dto/events.dto';
import { EventService } from 'src/events/events.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolesService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(dto: UserDTO, user: any): Promise<User> {
    const hashedPassword = hashSync(dto.password, 10);
    const userRoles = await this.getUserRolesFromPermissions(dto.permission);
    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
      roles: userRoles,
    });
    const savedUser = await createdUser.save();
    const userData: EventsDto = {
      type: 'institution_created',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: savedUser.toObject(),
      old_data: null,
    };
    await this.eventService.create(userData);
    return createdUser;
  }

  async update(_id: string, dto: UserDTO, user: any): Promise<User> {
    const userRoles = await this.getUserRolesFromPermissions(dto.permission);
    const oldUser = await this.userModel.findById(_id).exec();
    if (!oldUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: _id },
        { ...dto, roles: userRoles },
        { new: true },
      )
      .exec();
    const eventData: EventsDto = {
      type: 'user_updated',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: updatedUser.toObject(),
      old_data: oldUser.toObject(),
    };
    await this.eventService.create(eventData);

    return updatedUser;
  }

  async remove(_id: string, user: any): Promise<User> {
    const userDelete = await this.userModel.findByIdAndDelete(_id).exec();
    if (!userDelete) {
      throw new NotFoundException('User not found');
    }
    const userData: EventsDto = {
      type: 'user_deleted',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: null,
      old_data: userDelete.toObject(),
    };
    await this.eventService.create(userData);
    return userDelete;
  }

  private async getUserRolesFromPermissions(
    permissions: string[],
  ): Promise<string[]> {
    const userRoles: string[] = [];
    for (const permissionName of permissions) {
      const permission =
        await this.permissionService.findOneByName(permissionName);
      if (!permission) {
        throw new NotFoundException(
          `Permission with name ${permissionName} not found`,
        );
      }
      for (const roleId of permission.roles) {
        if (!userRoles.includes(roleId)) {
          userRoles.push(roleId);
        }
      }
    }
    return userRoles;
  }
}
