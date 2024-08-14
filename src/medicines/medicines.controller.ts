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
import { MedicineService } from './medicines.service';
import { Medicines } from './medicines.shema';
import { MedicinesDTO } from './dto/medicines.dto';

  
  @Controller('medicines')
  @UseGuards(AuthGuard('jwt'))
  export class MedicinesController {
    constructor(private medicineService: MedicineService){}
  
    @Get()
    async findAll(): Promise<Medicines[]> {
      return this.medicineService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Medicines> {
      return this.medicineService.findOne(id);
    }
  
    @Post()
    async create(
      @Body() dto: MedicinesDTO,
      @Req() req: any,
    ): Promise<Medicines> {
      const user = req.user;
      return this.medicineService.create(dto, user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: MedicinesDTO,
      @Req() req: any,
    ): Promise<Medicines> {
      const user = req.user;
      return this.medicineService.update(id, dto, user);
    }
  
    @Delete(':id')
    async delete(
      @Param('id') id: string,
      @Req() req: any,
    ): Promise<Medicines> {
      const user = req.user;
      return this.medicineService.delete(id, user);
    }
  
  }
  