import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Institutions extends Document {
  @Prop({ unique: true })
  code: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop({ type: Object })
  address: {
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
  };

  @Prop()
  unit: string;

  @Prop({ type: [String], default: [] })
  type: string[];

  @Prop({ type: [String], default: [] })
  related_units: string[];
}
export const InstiturionSchema = SchemaFactory.createForClass(Institutions);
