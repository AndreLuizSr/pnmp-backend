import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Events } from './events.schema';
import { Model } from 'mongoose';
import { EventsDto } from './dto/events.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

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
    try {
      const createdEvent = new this.eventsModel(dto);
      return await createdEvent.save();
    } catch (error) {
      this.logger.error('Erro ao criar evento', error);
      throw error;
    }
  }

  async createEvent(
    type: string,
    reference: string,
    user: any,
    newData: any,
    oldData: any = null,
  ): Promise<void> {
    const eventData: EventsDto = {
      type,
      reference,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: newData,
      old_data: oldData,
    };

    try {
      await this.create(eventData);
    } catch (error) {
      this.logger.error(`Falha ao criar evento: ${type}`, error);
    }
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
