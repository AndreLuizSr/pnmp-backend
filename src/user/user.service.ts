import {
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
  forwardRef,
} from '@nestjs/common';
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
export class UserService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rolesService: RoleService,
    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService,
    private readonly eventService: EventService,
  ) {}

  async onApplicationBootstrap() {
    
    const all = await this.userModel.countDocuments().exec();
      if(all == 0 ) {
        
        const userRoles: string[] = [];
        for (const roleId of this.rolesService.getAll()) {
            userRoles.push(roleId.key);
        }

        const createdUser = new this.userModel({
          name: "Administrador",
          password: hashSync("12345", 10),
          email: "admin@admin.com",
          phone: "",
          institution: "",
          roles: userRoles,
          permission: ""
        });
        createdUser.save();
      }
       
  }

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

    await this.eventService.createEvent(
      'user_created',
      user.id,
      user,
      savedUser.toObject(),
    );

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
        { _id },
        { ...dto, roles: userRoles },
        { new: true },
      )
      .exec();

    await this.eventService.createEvent(
      'user_updated',
      user.id,
      user,
      updatedUser.toObject(),
      oldUser.toObject(),
    );

    return updatedUser;
  }

  async delete(_id: string, user: any): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete({ _id }).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    await this.eventService.createEvent(
      'user_deleted',
      user.id,
      user,
      null,
      deletedUser.toObject(),
    );

    return deletedUser;
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

  async syncUserRoles(permissionName: string): Promise<void> {
    const permission =
      await this.permissionService.findOneByName(permissionName);
    if (!permission) {
      throw new NotFoundException(
        `Permission with name ${permissionName} not found`,
      );
    }

    const users = await this.userModel
      .find({ permission: permissionName })
      .exec();
    for (const user of users) {
      const userRoles = await this.getUserRolesFromPermissions(user.permission);
      user.roles = userRoles;
      await user.save();
    }
  }
}
