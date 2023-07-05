import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CategoryModule } from "./category/category.module";
import { QuotesModule } from "./quotes/quotes.module";
import { SharedModule } from "./shared/shared.module";
import { TagsModule } from "./tags/tags.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
    }),
    ConfigModule.forRoot({ envFilePath: ".env" }),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    CategoryModule,
    TagsModule,
    QuotesModule,
    SharedModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
