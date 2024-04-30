import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitDTO } from './dto/units.dto';
import { Units } from './units.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('units')
@UseGuards(AuthGuard('jwt'))
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async create(@Body() unitDTO: UnitDTO, @Req() req: any): Promise<Units> {
    const user = req.user;
    return this.unitsService.create(unitDTO, user);
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
    @Req() req: any,
  ): Promise<Units> {
    const user = req.user;
    return this.unitsService.update(_id, unitDTO, user);
  }

  @Delete(':_id')
  async delete(@Param('_id') _id: string, @Req() req: any): Promise<Units> {
    const user = req.user;
    return this.unitsService.delete(_id, user);
  }
}
