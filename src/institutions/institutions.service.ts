import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Institutions } from './institutions.schema';
import { Model } from 'mongoose';
import { InstitutionsDTO } from './dto/institutions.dto';
import { UnitsService } from 'src/units/units.service';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institutions.name)
    private institutionsModel: Model<Institutions>,
    private unitsService: UnitsService,
  ) {}

  async findAll(): Promise<Institutions[]> {
    return this.institutionsModel.find().exec();
  }

  async findOne(_id: string): Promise<Institutions> {
    return this.institutionsModel.findOne({ _id }).exec();
  }

  async create(dto: InstitutionsDTO): Promise<Institutions> {
    const unit = await this.unitsService.findOneByCode(dto.unit);
    if (!unit) {
      throw new NotFoundException('Not found!');
    }
    const related_units = unit.related_units;
    if (!this.isValidTypes(dto.type)) {
      throw new BadRequestException('Tipos inválidos.');
    }
    const createdInstitution = new this.institutionsModel({
      ...dto,
      related_units,
    });
    return createdInstitution.save();
  }

  async update(_id: string, dto: InstitutionsDTO): Promise<Institutions> {
    const unit = await this.unitsService.findOneByCode(dto.unit);
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }
    const related_units = unit.related_units;
    if (!this.isValidTypes(dto.type)) {
      throw new BadRequestException('Tipos inválidos.');
    }
    const updatedInstitution = await this.institutionsModel
      .findOneAndUpdate({ _id }, { ...dto, related_units }, { new: true })
      .exec();
    return updatedInstitution;
  }

  async delete(_id: string): Promise<Institutions> {
    return this.institutionsModel.findOneAndDelete({ _id }).exec();
  }

  private isValidTypes(types: string[]): boolean {
    const allowedTypes = ['Notification', 'Treatment', 'Medicine Store'];
    return (
      types.length >= 1 &&
      types.length <= 3 &&
      types.every((type) => allowedTypes.includes(type))
    );
  }
}
