import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { Document } from "mongoose";

export type TagsDocument = Tags & Document;

@Schema({ versionKey: false })
export class Tags {
  @Prop({ type: String })
  @Expose()
  value: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);
