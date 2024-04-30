import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';
import { UnitsModule } from './units/units.module';
import { InstitutionModule } from './institutions/institutions.module';
import { EventModule } from './events/events.module';

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
    EventModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
