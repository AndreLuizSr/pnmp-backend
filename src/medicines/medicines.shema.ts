import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Medicines extends Document {

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  type: string;

  @Prop()
  dosage: string;

  @Prop()
  dosage_type: string;

  @Prop()
  presentation: string;

  @Prop()
  source : string;

}

export const MedicineSchema = SchemaFactory.createForClass(Medicines);
