import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quote } from "src/quotes/schemas/quote.schema";
import { CreateTagsDto } from "./dto/create-tags.dto";
import { Tags } from "./schema/tags.schema";

@Injectable()
export class TagsService {
  constructor(@InjectModel("tags") private tagsModel: Model<Tags>, @InjectModel("quotes") private quotesModel: Model<Quote>) {}

  async createTag(createTagsDto: CreateTagsDto): Promise<Tags> {
    createTagsDto.value = createTagsDto.value.toLowerCase();
    const tags = await this.tagsModel.findOne(createTagsDto);
    if (!tags) {
      const create_tag = new this.tagsModel(createTagsDto);
      return create_tag.save();
    } else {
      return tags;
    }
  }

  async getTags(): Promise<Tags[]> {
    const tags = await this.tagsModel.find();
    const results = await Promise.all(
      tags.map(async tag => {
        const total = await this.quotesModel.countDocuments({ tags: { $in: tag }, verified: true });
        const newTag = tag.toObject();
        Object.assign(newTag, { quotes_count: total });
        return newTag;
      }),
    );
    results.sort((a, b) => b["quotes_count"] - a["quotes_count"]);
    return results;
  }

  async getTag(id: string): Promise<Tags> {
    return await this.tagsModel.findById(id);
  }

  async getTagByValue(value: string): Promise<Tags> {
    return await this.tagsModel.findOne({ value });
  }

  async deleteTag(id: string): Promise<any> {
    return await this.tagsModel.deleteOne({ _id: id });
  }
}
