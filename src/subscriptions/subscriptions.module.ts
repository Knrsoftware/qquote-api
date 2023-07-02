import { Module } from "@nestjs/common";
import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsService } from "./subscriptions.service";
import { SharedModule } from "src/shared/shared.module";
import { SharedService } from "src/shared/shared.service";
import { SubscriptionSchema } from "./schemas/subscription.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [MongooseModule.forFeature([{ name: "subscriptions", schema: SubscriptionSchema }]), SharedModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SharedService],
})
export class SubscriptionsModule {}
