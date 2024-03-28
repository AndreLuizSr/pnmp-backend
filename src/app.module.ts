import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/users.module';
//import { AuthModule, AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.modulo';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/'),
    UsersModule,
    RolesModule,
    PermissionModule,
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
