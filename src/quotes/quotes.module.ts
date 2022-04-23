import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteSchema } from './schemas/quote.schema';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'quotes', schema: QuoteSchema }]),
    SharedModule,
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
