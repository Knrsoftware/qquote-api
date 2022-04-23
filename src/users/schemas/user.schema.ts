import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String })
  @Expose()
  name: string;

  @Prop({ type: String, required: true })
  @Expose()
  username: string;

  @Prop({ type: String, required: true })
  @Exclude()
  password: string;

  @Prop({ type: String, required: true })
  @Expose()
  email: string;

  @Prop({ type: String })
  @Expose()
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
