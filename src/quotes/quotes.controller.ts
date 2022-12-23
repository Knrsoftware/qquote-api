import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { SharedService } from "src/shared/shared.service";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService, private sharedService: SharedService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    return this.sharedService.successResponse("Create Quote", await this.quotesService.create(createQuoteDto));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: PaginationParamsDto) {
    return this.sharedService.successResponse("Get Quotes", await this.quotesService.findAll(query.limit, query.offset));
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.sharedService.successResponse("Get Quote", await this.quotesService.findOne(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.sharedService.successResponse("Update Quote", await this.quotesService.update(id, updateQuoteDto));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.sharedService.successResponse("Delete Quote", await this.quotesService.remove(id));
  }
}
