import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Events } from './events.schema';
import { Model } from 'mongoose';
import { EventsDto } from './dto/events.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Events.name)
    private eventsModel: Model<Events>,
  ) {}

  async findAll(): Promise<Events[]> {
    return this.eventsModel.find().exec();
  }

  async findById(id: string): Promise<Events | null> {
    return this.eventsModel.findById(id).exec();
  }

  async create(dto: EventsDto): Promise<Events> {
    const createdEvent = new this.eventsModel(dto);
    return createdEvent.save();
  }

  async update(id: string, dto: EventsDto): Promise<Events | null> {
    const existingEvent = await this.eventsModel.findById(id).exec();

    if (!existingEvent) {
      return null;
    }

    const newData = dto.new_data;
    const oldData = {};
    let hasChanges = false;

    for (const key in newData) {
      if (existingEvent[key] !== newData[key]) {
        oldData[key] = existingEvent[key];
        existingEvent[key] = newData[key];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      existingEvent.old_data = oldData;
      await existingEvent.save();
    }

    return existingEvent;
  }

  async delete(id: string): Promise<Events | null> {
    return this.eventsModel.findByIdAndDelete(id).exec();
  }
}
