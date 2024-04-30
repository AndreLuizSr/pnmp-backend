import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstitutionController } from './institutions.controller';
import { InstiturionSchema, Institutions } from './institutions.schema';
import { InstitutionService } from './institutions.service';
import { UnitsModule } from 'src/units/units.module';
import { EventModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institutions.name, schema: InstiturionSchema },
    ]),
    UnitsModule,
    EventModule,
  ],
  controllers: [InstitutionController],
  providers: [InstitutionService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
