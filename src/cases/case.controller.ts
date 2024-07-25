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
  import { CaseService } from './case.service';
  import { CaseDTO } from './dto/case.dto';
import { Cases } from './case.schema';
  
  @Controller('case')
  @UseGuards(AuthGuard('jwt'))
  export class CaseController {
    constructor(private caseService: CaseService) {}
  
    @Get()
    async findAll(): Promise<Cases[]> {
      return this.caseService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Cases> {
      return this.caseService.findOne(id);
    }
  
    @Post()
    async create(
      @Body() dto: CaseDTO,
      @Req() req: any,
    ): Promise<Cases> {
      const user = req.user;
      return this.caseService.create(dto, user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: CaseDTO,
      @Req() req: any,
    ): Promise<Cases> {
      const user = req.user;
      return this.caseService.update(id, dto, user);
    }
  
    @Delete(':id')
    async delete(
      @Param('id') id: string,
      @Req() req: any,
    ): Promise<Cases> {
      const user = req.user;
      return this.caseService.delete(id, user);
    }
  }
  