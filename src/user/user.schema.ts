import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phone: string;

  @Prop()
  institution: string;

  @Prop({ type: [{ type: String, ref: 'Roles' }], default: [] })
  roles: string[];

  @Prop({ type: [{ type: String, ref: 'Permission' }], default: [] })
  permission: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
