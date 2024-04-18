import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Units extends Document {
  @Prop({ unique: true })
  code: string;

  @Prop()
  name: string;

  @Prop()
  parent_unit: string;

  @Prop()
  type: string;

  @Prop({ type: [String], default: [] })
  related_units: string[];
}

export const UnitSchema = SchemaFactory.createForClass(Units);
