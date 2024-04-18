import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitDTO } from './dto/units.dto';
import { Units } from './units.schema';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async create(@Body() unitDTO: UnitDTO): Promise<Units> {
    return this.unitsService.create(unitDTO);
  }

  @Get()
  async findAll(): Promise<Units[]> {
    return this.unitsService.findAll();
  }

  @Get(':_id')
  async findOne(@Param('_id') _id: string): Promise<Units> {
    return this.unitsService.findOne(_id);
  }

  @Put(':_id')
  async update(
    @Param('_id') _id: string,
    @Body() unitDTO: UnitDTO,
  ): Promise<Units> {
    return this.unitsService.update(_id, unitDTO);
  }

  @Delete(':_id')
  async delete(@Param('_id') _id: string): Promise<Units> {
    return this.unitsService.delete(_id);
  }
}
