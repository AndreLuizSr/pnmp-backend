import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/users.module';
//import { AuthModule, AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';
import { UnitsModule } from './units/units.module';
import { InstitutionModule } from './institutions/institutions.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/pnmp', {
      authSource: 'admin',
    }),
    UsersModule,
    RolesModule,
    PermissionModule,
    UnitsModule,
    InstitutionModule,
    //AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
