import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Events extends Document {
  @Prop()
  type: string;

  @Prop()
  reference: string;

  @Prop({ default: Date.now })
  datetime: Date;

  @Prop({ type: Object })
  user: {
    name: string;
    email: string;
    institution: string;
  };

  @Prop({ type: Object })
  new_data: object;

  @Prop({ type: Object })
  old_data: object;
}
export const EventSchema = SchemaFactory.createForClass(Events);
