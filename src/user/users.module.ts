import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { RoleService } from 'src/roles/role.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
    PermissionModule,
  ],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserService, RoleService],
})
export class UsersModule {}
