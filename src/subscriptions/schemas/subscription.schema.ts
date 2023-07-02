import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { Document } from "mongoose";

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true, versionKey: false })
export class Subscription {
  @Prop({ type: String })
  @Expose()
  email: string;

  @Prop({ type: Boolean, default: true })
  @Expose()
  active: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
