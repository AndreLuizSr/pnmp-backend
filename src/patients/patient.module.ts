import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Patients, PatientsSchema } from './patient.schema';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { EventModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Patients.name, schema: PatientsSchema}
    ]),
    EventModule
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}