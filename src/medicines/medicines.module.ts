import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'src/events/events.module';
import { Medicines, MedicineSchema } from './medicines.shema';
import { MedicinesController } from './medicines.controller';
import { MedicineService } from './medicines.service';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Medicines.name, schema: MedicineSchema}
    ]),
    EventModule
  ],
  controllers: [MedicinesController],
  providers: [MedicineService],
  exports: [MedicineService],
})
export class MedicinesModule {}