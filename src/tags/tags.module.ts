import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";
import { TagsSchema } from "./schema/tags.schema";
import { QuoteSchema } from "src/quotes/schemas/quote.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "tags", schema: TagsSchema },
      { name: "quotes", schema: QuoteSchema },
    ]),
    SharedModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
