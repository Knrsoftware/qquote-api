import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { SharedService } from "src/shared/shared.service";
import { SubscriptionsService } from "./subscriptions.service";
import { check_permissions } from "src/authz/access.decorator";
import { AuthorizationGuard } from "src/authz/auth.guard";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService, private sharedService: SharedService) {}
  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.sharedService.successResponse("Subscribed to emails", await this.subscriptionsService.create(createSubscriptionDto));
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  @check_permissions("read:subscriptions")
  async get() {
    return this.sharedService.successResponse("Get subscribed emails", await this.subscriptionsService.getAll());
  }

  @Get(":email/unsubscribe")
  async edit(@Param("email") email: string) {
    return this.sharedService.successResponse("Unsubscribed from emails", await this.subscriptionsService.unsubscribe(email));
  }

  @Delete(":id")
  @UseGuards(AuthorizationGuard)
  @check_permissions("delete:subscriptions")
  async delete(@Param("id") id: string) {
    return this.sharedService.successResponse("Subscription deleted", await this.subscriptionsService.delete(id));
  }
}
