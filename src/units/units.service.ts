import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnitDTO } from './dto/units.dto';
import { Units } from './units.schema';

@Injectable()
export class UnitsService {
  constructor(@InjectModel(Units.name) private unitModel: Model<Units>) {}

  async findAll(): Promise<Units[]> {
    return this.unitModel.find().exec();
  }

  async findOne(_id: string): Promise<Units> {
    return this.unitModel.findOne({ _id }).exec();
  }

  async findOneByCode(code: string): Promise<Units> {
    return this.unitModel.findOne({ code }).exec();
  }

  async create(dto: UnitDTO): Promise<Units> {
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
    return createdUnit.save();
  }

  async update(_id: string, dto: UnitDTO): Promise<Units> {
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
      .findOneAndUpdate(
        { _id },
        {
          $set: { ...dto, type },
          $addToSet: { related_units: parentUnit ? parentUnit.code : null },
        },
        { new: true },
      )
      .exec();

    return updatedUnit;
  }

  async delete(_id: string): Promise<Units> {
    return this.unitModel.findOneAndDelete({ _id }).exec();
  }
}
