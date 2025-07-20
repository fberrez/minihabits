import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export class UserSettings {}

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Object, required: false, default: {} })
  settings: UserSettings;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: String, required: false })
  passwordResetToken?: string;

  @Prop({ type: Date, required: false })
  passwordResetExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
