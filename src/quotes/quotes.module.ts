import { Module } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { QuotesController } from "./quotes.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { QuoteSchema } from "./schemas/quote.schema";
import { SharedModule } from "src/shared/shared.module";
import { TagsSchema } from "../tags/schema/tags.schema";
import { CategorySchema } from "src/category/schema/category.schema";
import { UserLikeSchema } from "./schemas/user_likes.schema";
import { TagsModule } from "src/tags/tags.module";
import { TagsService } from "src/tags/tags.service";
import { CategoryModule } from "src/category/category.module";
import { CategoryService } from "src/category/category.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "quotes", schema: QuoteSchema },
      { name: "categories", schema: CategorySchema },
      { name: "tags", schema: TagsSchema },
      { name: "user_likes", schema: UserLikeSchema },
    ]),
    CategoryModule,
    TagsModule,
    SharedModule,
  ],
  controllers: [QuotesController],
  providers: [QuotesService, TagsService, CategoryService],
})
export class QuotesModule {}
