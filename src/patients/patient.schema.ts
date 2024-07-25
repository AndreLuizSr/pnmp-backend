import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Patients extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  social_name: string;

  @Prop({ required: true })
  health_number: string;

  @Prop()
  fiscal_number: string;

  @Prop({ required: true })
  birthdate: string;

  @Prop({ required: true })
  sex: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  mother_name: string;

  @Prop({ required: true })
  country: string;

  @Prop({ type: Object, required: true })
  attributes: {
    weight: string;
    education: string;
    job: string;
  };

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Object })
  address: {
    address_line_1: string;
    address_line_2: string;
    postal_code: string;
  };

  @Prop()
  zone: string;

  @Prop()
  unit: string;

  @Prop()
  city: string;
}

export const PatientsSchema = SchemaFactory.createForClass(Patients);
