import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { Quote } from "./schemas/quote.schema";
import { Model } from "mongoose";
import { Category } from "src/category/schema/category.schema";
import { UserLike } from "./schemas/user_likes.schema";
import { TagsService } from "src/tags/tags.service";
import { CategoryService } from "src/category/category.service";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

@Injectable()
export class QuotesService {
  constructor(
    @InjectModel("quotes") private quotesModel: Model<Quote>,
    @InjectModel("user_likes") private userLikesModel: Model<UserLike>,
    private categoryService: CategoryService,
    private tagsService: TagsService,
  ) {}
  async create(userId: string, createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const quote = new this.quotesModel(createQuoteDto);
    quote.created_by = userId;
    quote.category = await this.categoryService.createCategory({ name: createQuoteDto.category, description: createQuoteDto.category });
    quote.tags = await Promise.all(
      createQuoteDto.tags.map(async tag => {
        return await this.tagsService.createTag({ value: tag });
      }),
    );
    return quote.save();
  }

  async findAll(userId: string, query: PaginationParamsDto): Promise<{ quotes: Quote[]; total: number }> {
    const total = await this.quotesModel.countDocuments();
    const quotes = await this.quotesModel.find(
      {
        ...(query.addedBy && { created_by: query.addedBy }),
        ...(query.category && { category: await this.categoryService.getCategory(query.category) }),
        ...(query.tag && { tags: { $in: await this.tagsService.getTag(query.tag) } }),
      },
      {},
      {
        ...(query.limit && { limit: query.limit }),
        ...(query.offset && { skip: query.offset }),
        sort: { _id: -1 },
      },
    );
    const results = await Promise.all(
      quotes.map(async quote => {
        quote.total_likes = await this.userLikesModel.countDocuments({ quote_id: quote.id });
        quote.liked = userId && (await this.userLikesModel.findOne({ user_id: userId, quote_id: quote.id })) ? true : false;
        return quote;
      }),
    );
    return { quotes: results, total };
  }

  async findOne(id: string): Promise<Quote> {
    return await this.quotesModel.findById(id);
  }

  async update(userId: string, quoteId: string, updateQuoteDto: UpdateQuoteDto) {
    try {
      const quote = await this.quotesModel.findOne({ id: quoteId, created_by: userId });
      if (updateQuoteDto.category) {
        quote.category = await this.categoryService.createCategory({ name: updateQuoteDto.category, description: updateQuoteDto.category });
      }
      Object.assign(quote, updateQuoteDto);
      return this.quotesModel.findOneAndUpdate({ id: quoteId }, quote);
    } catch (error) {
      console.error(error);
      throw new BadGatewayException(error.message);
    }
  }

  async react(userId: string, quoteId: string) {
    const userLike = await this.userLikesModel.findOne({ user_id: userId, quote_id: quoteId });
    if (userLike) {
      await this.userLikesModel.deleteOne({ user_id: userId, quote_id: quoteId });
      return "Quote disliked";
    }
    const create_userLike = new this.userLikesModel({ user_id: userId, quote_id: quoteId });
    await create_userLike.save();
    return "Quote liked";
  }

  async remove(userId: string, quoteId: string) {
    return await this.quotesModel.deleteOne({ _id: quoteId, created_by: userId });
  }
}
