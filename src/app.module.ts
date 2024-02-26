import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user/users.module';
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CorsMiddleware } from './middleware/cors.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/'),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
