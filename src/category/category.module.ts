import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuoteSchema } from "src/quotes/schemas/quote.schema";
import { SharedModule } from "src/shared/shared.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategorySchema } from "./schema/category.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "categories", schema: CategorySchema },
      { name: "quotes", schema: QuoteSchema },
    ]),
    SharedModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
