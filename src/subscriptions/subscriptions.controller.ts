import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { SharedService } from "src/shared/shared.service";
import { SubscriptionsService } from "./subscriptions.service";
import { check_permissions } from "src/authz/access.decorator";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService, private sharedService: SharedService) {}
  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.sharedService.successResponse("Subscribed to emails", await this.subscriptionsService.create(createSubscriptionDto));
  }

  @Get()
  @check_permissions("read:subscriptions")
  async get() {
    return this.sharedService.successResponse("Get subscribed emails", await this.subscriptionsService.getAll());
  }

  @Delete(":email")
  async edit(@Param("email") email: string) {
    return this.sharedService.successResponse("Subscription deleted", await this.subscriptionsService.delete(email));
  }
}
