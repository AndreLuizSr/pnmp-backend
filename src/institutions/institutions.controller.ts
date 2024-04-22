import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Institutions } from './institutions.schema';
import { InstitutionsDTO } from './dto/institutions.dto';
import { InstitutionService } from './institutions.service';

@Controller('institutions')
export class InstitutionController {
  constructor(private institutionService: InstitutionService) {}

  @Get()
  async findAll(): Promise<Institutions[]> {
    return this.institutionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Institutions> {
    return this.institutionService.findOne(id);
  }

  @Post()
  async create(@Body() dto: InstitutionsDTO): Promise<Institutions> {
    return this.institutionService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: InstitutionsDTO,
  ): Promise<Institutions> {
    return this.institutionService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Institutions> {
    return this.institutionService.delete(id);
  }
}
