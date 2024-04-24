import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Events } from './events.schema';
import { EventController } from './events.controller';
import { EventService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Events.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
