import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { RoleService } from 'src/roles/role.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionModule } from 'src/permission/permission.module';
import { EventModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
    forwardRef(() => PermissionModule),
    EventModule,
  ],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserService, RoleService, MongooseModule],
})
export class UsersModule {}
