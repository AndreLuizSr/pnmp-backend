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
import { Institutions } from './institutions.schema';
import { InstitutionsDTO } from './dto/institutions.dto';
import { InstitutionService } from './institutions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('institutions')
@UseGuards(AuthGuard('jwt'))
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
  async create(
    @Body() dto: InstitutionsDTO,
    @Req() req: any,
  ): Promise<Institutions> {
    const user = req.user;
    return this.institutionService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: InstitutionsDTO,
    @Req() req: any,
  ): Promise<Institutions> {
    const user = req.user;
    return this.institutionService.update(id, dto, user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Institutions> {
    const user = req.user;
    return this.institutionService.delete(id, user);
  }
}
