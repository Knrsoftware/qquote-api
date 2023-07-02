import { Injectable } from "@nestjs/common";
import { Subscription } from "./schemas/subscription.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(@InjectModel("subscriptions") private subscriptionsModel: Model<Subscription>) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionsModel.findOne({ email: createSubscriptionDto.email });
    if (!subscription) {
      const create_subscription = new this.subscriptionsModel(createSubscriptionDto);
      return await create_subscription.save();
    }
    return subscription;
  }

  async getAll() {
    const subscriptions = await this.subscriptionsModel.find();
    return subscriptions;
  }

  async delete(email: string) {
    await this.subscriptionsModel.findOneAndUpdate({ email }, { active: false });
    return true;
  }
}
