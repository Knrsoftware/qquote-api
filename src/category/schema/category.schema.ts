import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { Document } from "mongoose";

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false })
export class Category {
  @Prop({ type: String })
  @Expose()
  name: string;

  @Prop({ type: String })
  @Expose()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
