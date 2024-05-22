import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from 'src/roles/role.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission, PermissionSchema } from './permission.schema';
import { EventModule } from 'src/events/events.module';
import { UsersModule } from 'src/user/users.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    RolesModule,
    EventModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, RoleService, UserService],
  exports: [PermissionService, RoleService],
})
export class PermissionModule {}
