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
import { EventsDto } from 'src/events/dto/events.dto';
import { EventService } from 'src/events/events.service';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institutions.name)
    private institutionsModel: Model<Institutions>,
    private unitsService: UnitsService,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<Institutions[]> {
    return this.institutionsModel.find().exec();
  }

  async findOne(_id: string): Promise<Institutions> {
    return this.institutionsModel.findOne({ _id }).exec();
  }

  async create(dto: InstitutionsDTO, user: any): Promise<Institutions> {
    const unit = await this.unitsService.findOneByCode(dto.unit);
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }
    if (unit.type !== 'Cidade') {
      throw new BadRequestException('A unidade fornecida deve ser uma cidade.');
    }
    const related_units = unit.related_units;
    if (!this.isValidTypes(dto.type)) {
      throw new BadRequestException('Tipos inválidos.');
    }
    const createdInstitution = new this.institutionsModel({
      ...dto,
      related_units,
    });
    const savedInstitution = await createdInstitution.save();

    const institutionData: EventsDto = {
      type: 'institution_created',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: savedInstitution.toObject(),
      old_data: null,
    };
    await this.eventService.create(institutionData);

    return createdInstitution;
  }

  async update(
    _id: string,
    dto: InstitutionsDTO,
    user: any,
  ): Promise<Institutions> {
    const unit = await this.unitsService.findOneByCode(dto.unit);
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }
    if (unit.type !== 'Cidade') {
      throw new BadRequestException('A unidade fornecida deve ser uma cidade.');
    }
    const related_units = unit.related_units;
    if (!this.isValidTypes(dto.type)) {
      throw new BadRequestException('Tipos inválidos.');
    }
    const existingInstitution = await this.institutionsModel
      .findById(_id)
      .exec();
    if (!existingInstitution) {
      throw new NotFoundException('Instituição não encontrada');
    }
    const oldData = { ...existingInstitution.toObject() };

    const updatedInstitution = await this.institutionsModel
      .findByIdAndUpdate(_id, { ...dto, related_units }, { new: true })
      .exec();
    const institutionData: EventsDto = {
      type: 'institution_updated',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: updatedInstitution.toObject(),
      old_data: oldData,
    };
    await this.eventService.create(institutionData);

    return updatedInstitution;
  }

  async delete(_id: string, user: any): Promise<Institutions> {
    const deletedInstitution = await this.institutionsModel
      .findByIdAndDelete(_id)
      .exec();
    if (!deletedInstitution) {
      throw new NotFoundException('Instituição não encontrada');
    }
    const eventData: EventsDto = {
      type: 'institution_deleted',
      reference: user.id,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
      },
      new_data: null,
      old_data: deletedInstitution.toObject(),
    };
    await this.eventService.create(eventData);

    return deletedInstitution;
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
