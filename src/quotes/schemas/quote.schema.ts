import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { Document } from 'mongoose';

export type QuoteDocument = Quote & Document;

@Schema()
export class Quote {
  @Prop({ type: String })
  @Expose()
  id: string;

  @Prop({ type: String })
  @Expose()
  title: string;

  @Prop({ type: String })
  @Expose()
  subtitle: string;

  @Prop({ type: String })
  @Expose()
  author: string;

  @Prop({ type: String })
  @Expose()
  reference: string;

  @Prop({ type: String })
  @Expose()
  tags: string;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
