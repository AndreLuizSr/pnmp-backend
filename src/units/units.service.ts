import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnitDTO } from './dto/units.dto';
import { Units } from './units.schema';
import { EventsDto } from 'src/events/dto/events.dto';
import { EventService } from 'src/events/events.service';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Units.name) private unitModel: Model<Units>,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<Units[]> {
    return this.unitModel.find().exec();
  }

  async findOne(_id: string): Promise<Units> {
    return this.unitModel.findOne({ _id }).exec();
  }

  async findOneByCode(code: string): Promise<Units> {
    return this.unitModel.findOne({ code }).exec();
  }

  async create(dto: UnitDTO, user: any): Promise<Units> {
    const existingUnit = await this.unitModel.findOne({ code: dto.code });
    if (existingUnit) {
      throw new ConflictException('Já existe uma unidade com este código.');
    }

    const parentUnit = await this.unitModel.findOne({
      code: dto.parent_unit,
    });

    let type = '';
    if (!parentUnit) {
      type = 'Região';
    } else if (parentUnit.type === 'Região') {
      type = 'Estado';
    } else if (parentUnit.type === 'Estado') {
      type = 'Cidade';
    }

    const relatedUnits = parentUnit
      ? [...parentUnit.related_units, parentUnit.code]
      : [];

    const createdUnit = new this.unitModel({
      ...dto,
      type,
      related_units: relatedUnits,
    });
    const savedUnits = await createdUnit.save();

    const eventData: EventsDto = {
      type: 'unit_created',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: savedUnits.toObject(),
      old_data: null,
    };
    await this.eventService.create(eventData);

    return createdUnit;
  }

  async update(_id: string, dto: UnitDTO, user: any): Promise<Units> {
    const existingUnit = await this.unitModel.findById(_id).exec();
    if (!existingUnit) {
      throw new NotFoundException('Unidade não encontrada');
    }
    const oldData = { ...existingUnit.toObject() };
    const parentUnit = await this.unitModel.findOne({
      code: dto.parent_unit,
    });
    let type = '';
    if (!parentUnit) {
      type = 'Região';
    } else if (parentUnit.type === 'Região') {
      type = 'Estado';
    } else if (parentUnit.type === 'Estado') {
      type = 'Cidade';
    }
    const updatedUnit = await this.unitModel
      .findByIdAndUpdate(
        _id,
        {
          $set: { ...dto, type },
          $addToSet: { related_units: parentUnit ? parentUnit.code : null },
        },
        { new: true },
      )
      .exec();
    const eventData: EventsDto = {
      type: 'unit_updated',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: updatedUnit.toObject(),
      old_data: oldData,
    };
    await this.eventService.create(eventData);

    return updatedUnit;
  }

  async delete(_id: string, user: any): Promise<Units> {
    const deletedUnit = await this.unitModel.findOneAndDelete({ _id }).exec();
    if (!deletedUnit) {
      throw new NotFoundException('Unidade não encontrada');
    }

    const eventData: EventsDto = {
      type: 'unit_deleted',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: null,
      old_data: deletedUnit.toObject(),
    };
    await this.eventService.create(eventData);

    return deletedUnit;
  }
}
