import { MongooseModule } from "@nestjs/mongoose";
import { Cases, CasesSchema } from "./case.schema";
import { EventModule } from "src/events/events.module";
import { Module } from '@nestjs/common';
import { CaseController } from "./case.controller";
import { CaseService } from "./case.service";

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Cases.name, schema: CasesSchema},
    ]),
    EventModule
  ],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}