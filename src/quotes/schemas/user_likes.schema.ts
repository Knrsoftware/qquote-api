import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { Document } from "mongoose";

export type UserLikeDocument = UserLike & Document;

@Schema()
export class UserLike {
  @Prop({ type: String })
  @Expose()
  user_id: string;

  @Prop({ type: String })
  @Expose()
  quote_id: string;
}

export const UserLikeSchema = SchemaFactory.createForClass(UserLike);
