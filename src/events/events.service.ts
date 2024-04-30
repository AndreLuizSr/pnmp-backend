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
    return this.eventsModel
      .findOneAndUpdate({ _id: id }, dto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Events | null> {
    return this.eventsModel.findByIdAndDelete(id).exec();
  }
}
