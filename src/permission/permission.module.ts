import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from 'src/roles/role.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission, PermissionSchema } from './permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    RolesModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService, RoleService],
  exports: [PermissionService, RoleService],
})
export class PermissionModule {}
