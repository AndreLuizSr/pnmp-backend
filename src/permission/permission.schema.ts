import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permission extends Document {
  @Prop({ unique: true })
  name: string;

  @Prop({ type: [{ type: String, ref: 'Roles' }], default: [] })
  roles: string[];
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
