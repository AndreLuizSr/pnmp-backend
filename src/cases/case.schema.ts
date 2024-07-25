import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Cases extends Document {
  @Prop({ type: [{ type: String, ref: 'Patients' }], unique: true })
  patient_id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  work_related: boolean;

  @Prop({ required: true })
  first_symptoms_at: string;

  @Prop({ required: true })
  infection_source: string;

  @Prop({ type: [String], required: true })
  clinical_form: string[];

  @Prop({ type: [String] })
  associated_information: string[];

  @Prop({ required: false })
  associated_information_other: string;

  @Prop({ type: Object})
  exams: {
    type: string;
    data: string;
  }[];

  @Prop({ type: [{ conclusion: String, agent: String }], required: true })
  diagnostic_conclusion: {
    conclusion: string;
    agent: string;
    other: string;
  }[];
}

export const CasesSchema = SchemaFactory.createForClass(Cases);
