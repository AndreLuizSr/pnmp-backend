import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EventsDto } from './dto/events.dto';
import { Events } from './events.schema';
import { EventService } from './events.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(): Promise<Events[]> {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Events> {
    return this.eventService.findById(id);
  }

  @Post()
  async create(@Body() dto: EventsDto): Promise<Events> {
    return this.eventService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: EventsDto,
  ): Promise<Events> {
    return this.eventService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Events> {
    return this.eventService.delete(id);
  }
}
