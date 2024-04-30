import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { UnitSchema, Units } from './units.schema';
import { EventModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Units.name, schema: UnitSchema }]),
    EventModule,
  ],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
