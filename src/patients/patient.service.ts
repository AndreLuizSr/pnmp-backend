import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatientDTO } from './dto/patient.dto';
import { EventService } from 'src/events/events.service';
import { Patients } from './patient.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patients.name)
    private patientModel: Model<Patients>,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<Patients[]> {
    return this.patientModel.find().exec();
  }

  async findOne(_id: string): Promise<Patients> {
    return this.patientModel.findOne({ _id }).exec();
  }

  async create(dto: PatientDTO, user: any): Promise<Patients> {
    const createdPatient = new this.patientModel(dto);
    const savedPatient = await createdPatient.save();

    await this.eventService.createEvent(
      'patient_created',
      user.id,
      user,
      savedPatient.toObject(),
    );

    return savedPatient;
  }

  async update(_id: string, dto: PatientDTO, user: any): Promise<Patients> {
    const existingPatient = await this.patientModel.findById(_id).exec();
    if (!existingPatient) {
      throw new NotFoundException('Paciente não encontrado');
    }
    const oldData = { ...existingPatient.toObject() };

    const updatedPatient = await this.patientModel
      .findByIdAndUpdate(_id, dto, { new: true })
      .exec();

    await this.eventService.createEvent(
      'patient_updated',
      user.id,
      user,
      updatedPatient.toObject(),
      oldData,
    );

    return updatedPatient;
  }

  async delete(_id: string, user: any): Promise<Patients> {
    const deletedPatient = await this.patientModel
      .findByIdAndDelete(_id)
      .exec();
    if (!deletedPatient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    await this.eventService.createEvent(
      'patient_deleted',
      user.id,
      user,
      null,
      deletedPatient.toObject(),
    );

    return deletedPatient;
  }
}
