import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { CaseDTO } from './dto/case.dto';
  import { EventService } from 'src/events/events.service';
import { Cases } from './case.schema';
  
  @Injectable()
  export class CaseService {
    constructor(
      @InjectModel(Cases.name)
      private caseModel: Model<Cases>,
      private readonly eventService: EventService,
    ) {}
  
    async findAll(): Promise<Cases[]> {
      return this.caseModel.find().exec();
    }
  
    async findOne(_id: string): Promise<Cases> {
      return this.caseModel.findOne({ _id }).exec();
    }
  
    async create(dto: CaseDTO, user: any): Promise<Cases> {
      const createdCase = new this.caseModel(dto);
      const savedCase = await createdCase.save();
  
      await this.eventService.createEvent(
        'case_created',
        user.id,
        user,
        savedCase.toObject(),
      );
  
      return savedCase;
    }
  
    async update(_id: string, dto: CaseDTO, user: any): Promise<Cases> {
      const existingCase = await this.caseModel.findById(_id).exec();
      if (!existingCase) {
        throw new NotFoundException('Case not found');
      }
      const oldData = { ...existingCase.toObject() };
  
      const updatedCase = await this.caseModel
        .findByIdAndUpdate(_id, dto, { new: true })
        .exec();
  
      await this.eventService.createEvent(
        'case_updated',
        user.id,
        user,
        updatedCase.toObject(),
        oldData,
      );
  
      return updatedCase;
    }
  
    async delete(_id: string, user: any): Promise<Cases> {
      const deletedCase = await this.caseModel.findByIdAndDelete(_id).exec();
      if (!deletedCase) {
        throw new NotFoundException('Case not found');
      }
  
      await this.eventService.createEvent(
        'case_deleted',
        user.id,
        user,
        null,
        deletedCase.toObject(),
      );
  
      return deletedCase;
    }
  }
  