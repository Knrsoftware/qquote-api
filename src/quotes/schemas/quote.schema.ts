import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import { Document } from "mongoose";
import { Category, CategorySchema } from "src/category/schema/category.schema";
import { Tags, TagsSchema } from "src/tags/schema/tags.schema";

export type QuoteDocument = Quote & Document;

@Schema({ timestamps: true, versionKey: false })
export class Quote {
  @Prop({ type: String })
  @Expose()
  title: string;

  @Prop({ type: String })
  @Expose()
  subtitle: string;

  @Prop({ type: String })
  @Expose()
  author: string;

  @Prop({ type: CategorySchema })
  @Expose()
  category: Category;

  @Prop({ type: String })
  @Expose()
  reference: string;

  @Prop({ type: [TagsSchema] })
  @Expose()
  tags: Tags[];

  @Prop({ type: String })
  @Expose()
  created_by: string;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: Number, default: 0 })
  total_likes: number;
  @Prop({ type: Boolean, default: false })
  liked: boolean;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
