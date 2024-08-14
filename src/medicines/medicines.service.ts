import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicines } from './medicines.shema';
import { EventService } from 'src/events/events.service';
import { MedicinesDTO } from './dto/medicines.dto';

@Injectable()
export class MedicineService {
  constructor(
    @InjectModel(Medicines.name)
    private medicinesModel: Model<Medicines>,
    private readonly enventService: EventService,
  ) {}

  async findAll(): Promise<Medicines[]> {
    return this.medicinesModel.find().exec();
  }

  async findOne(_id: string): Promise<Medicines> {
    return this.medicinesModel.findOne({ _id }).exec();
  }

  async create(dto: MedicinesDTO, user: any): Promise<Medicines> {
    const existingMedicine = await this.medicinesModel.findOne({
      code: dto.code,
    });
    if (existingMedicine) {
      throw new ConflictException('Já existe um medicamento com este código.');
    }
    const createdMedicines = new this.medicinesModel({
      ...dto,
    });
    const savedMedicines = await createdMedicines.save();

    await this.enventService.createEvent(
      'medicines_created',
      user.id,
      user,
      savedMedicines.toObject(),
    );

    return createdMedicines;
  }

  async update(_id: string, dto: MedicinesDTO, user: any): Promise<Medicines> {
    const existingMedicine = await this.medicinesModel.findById(_id).exec();
    if (!existingMedicine) {
      throw new ConflictException('Medicamento não encontrado.');
    }
    const oldData = { ...existingMedicine.toObject() };

    const updateMedicine = await this.medicinesModel
      .findByIdAndUpdate(_id, dto, { new: true })
      .exec();

    await this.enventService.createEvent(
      'medicines_update',
      user.id,
      user,
      updateMedicine.toObject(),
      oldData,
    );

    return updateMedicine;
  }

  async delete(_id: string, user: any): Promise<Medicines> {
    const deleteMedicines = await this.medicinesModel
      .findByIdAndDelete(_id)
      .exec();
    if (!deleteMedicines) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    await this.enventService.createEvent(
        'medicines_deleted',
        user.id,
        user,
        null,
        deleteMedicines.toObject(),
    );

    return deleteMedicines;
  }
}
