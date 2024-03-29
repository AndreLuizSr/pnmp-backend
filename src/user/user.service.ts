import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashSync } from 'bcrypt';
import { User } from './user.schema';
import { UserModel } from './dto/user.dto';
import { RoleService } from 'src/roles/role.service';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolesService: RoleService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: UserModel): Promise<User> {
    const hashedPassword = hashSync(createUserDto.password, 10);
    const userRoles = await this.getUserRolesFromPermissions(
      createUserDto.permission,
    );
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      roles: userRoles,
    });
    return createdUser.save();
  }

  async update(email: string, updateUserDto: UserModel): Promise<User> {
    const userRoles = await this.getUserRolesFromPermissions(
      updateUserDto.permission,
    );
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { email },
        { ...updateUserDto, roles: userRoles },
        { new: true },
      )
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async remove(email: string): Promise<void> {
    const result = await this.userModel.deleteOne({ email }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  private async getUserRolesFromPermissions(
    permissions: string[],
  ): Promise<string[]> {
    const userRoles: string[] = [];
    for (const permissionName of permissions) {
      const permission =
        await this.permissionService.findOneByOne(permissionName);
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
