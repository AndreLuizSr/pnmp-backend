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
import { AuthGuard } from '@nestjs/passport';
import { PatientService } from './patient.service';
import { Patients } from './patient.schema';
import { PatientDTO } from './dto/patient.dto';

@Controller('patient')
@UseGuards(AuthGuard('jwt'))
export class PatientController {
  constructor(private patientService: PatientService){}

  @Get()
  async findAll(): Promise<Patients[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Patients> {
    return this.patientService.findOne(id);
  }

  @Post()
  async create(
    @Body() dto: PatientDTO,
    @Req() req: any,
  ): Promise<Patients> {
    const user = req.user;
    return this.patientService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: PatientDTO,
    @Req() req: any,
  ): Promise<Patients> {
    const user = req.user;
    return this.patientService.update(id, dto, user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Patients> {
    const user = req.user;
    return this.patientService.delete(id, user);
  }

}
