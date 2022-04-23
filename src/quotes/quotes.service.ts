import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote, QuoteDocument } from './schemas/quote.schema';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

@Injectable()
export class QuotesService {
  constructor(
    @InjectModel('quotes') private quotesModel: Model<QuoteDocument>,
  ) {}
  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const createdQuote = new this.quotesModel(createQuoteDto);
    return plainToClass(Quote, await createdQuote.save(), {
      excludeExtraneousValues: true,
    });
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<{ quotes: Quote[]; total: number }> {
    const total = await this.quotesModel.countDocuments();
    const quotes = await this.quotesModel.find({
      ...(limit && { limit: limit }),
      ...(offset && { skip: offset }),
    });
    const quotesOutput = plainToClass(Quote, quotes, {
      excludeExtraneousValues: true,
    });
    return {
      quotes: quotesOutput,
      total,
    };
  }

  async findOne(id: string): Promise<Quote> {
    return plainToClass(Quote, this.quotesModel.findById(id), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    await this.quotesModel.findOneAndUpdate({ id, ...updateQuoteDto });
    return plainToClass(
      Quote,
      { id, ...updateQuoteDto },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async remove(id: string) {
    await this.quotesModel.deleteOne({ _id: id });
    return plainToClass(Quote, id, {
      excludeExtraneousValues: true,
    });
  }
}
