import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { Quote } from "./schemas/quote.schema";
import { Model } from "mongoose";
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

  async findAll(userId: string, query: PaginationParamsDto, hasPermission: boolean): Promise<{ quotes: Quote[]; total: number }> {
    const total = await this.quotesModel.countDocuments({
      ...(!hasPermission && { verified: true }),
      ...(query.addedBy && { created_by: query.addedBy }),
      ...(query.category && { category: await this.categoryService.getCategoryByName(query.category) }),
      ...(query.tag && { tags: { $in: await this.tagsService.getTagByValue(query.tag) } }),
    });
    const quotes = await this.quotesModel.find(
      {
        ...(!hasPermission && { verified: true }),
        ...(query.addedBy && { created_by: query.addedBy }),
        ...(query.category && { category: await this.categoryService.getCategoryByName(query.category) }),
        ...(query.tag && { tags: { $in: await this.tagsService.getTagByValue(query.tag) } }),
      },
      {},
      {
        ...(query.limit && { limit: query.limit }),
        ...(query.page && { skip: query.limit * (query.page - 1) }),
        sort: { created_at: -1 },
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
    const quote = await this.quotesModel.findById(id);
    if (quote) {
      return quote;
    } else {
      throw new NotFoundException("Quote not found");
    }
  }

  async update(userId: string, quoteId: string, updateQuoteDto: UpdateQuoteDto, hasPermission: boolean) {
    let quote;
    if (hasPermission) {
      quote = await this.quotesModel.findById(quoteId);
    } else {
      quote = await this.quotesModel.findOne({ _id: quoteId, created_by: userId });
    }
    if (quote) {
      if (updateQuoteDto.category) {
        quote.category = await this.categoryService.createCategory({ name: updateQuoteDto.category, description: updateQuoteDto.category });
      }
      return await quote.save();
    } else {
      throw new NotFoundException("Quote not found");
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

  async verify(userId: string, quoteId: string) {
    try {
      const quote = await this.quotesModel.findById(quoteId);
      quote.verified = true;
      return await quote.save();
    } catch (error) {
      console.error(error);
      throw new BadGatewayException(error.message);
    }
  }

  async remove(userId: string, quoteId: string, hasPermission: boolean) {
    if (hasPermission) {
      return await this.quotesModel.deleteOne({ _id: quoteId });
    } else {
      return await this.quotesModel.deleteOne({ _id: quoteId, created_by: userId });
    }
  }
}
