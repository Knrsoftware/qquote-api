import { Controller, Get, Post, Put, Body, Param, Delete, Query, Req } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { SharedService } from "src/shared/shared.service";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";
import { UseGuards } from "@nestjs/common/decorators";
import { AuthorizationGuard } from "src/authz/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { isPublic } from "src/authz/access.decorator";

@Controller("quotes")
@ApiTags("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService, private sharedService: SharedService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async create(@Req() req, @Body() createQuoteDto: CreateQuoteDto) {
    return this.sharedService.successResponse("Create Quote", await this.quotesService.create(req.user.sub, createQuoteDto));
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  @isPublic()
  async findAll(@Req() req, @Query() query: PaginationParamsDto) {
    const userId = req?.user?.sub || null;
    return this.sharedService.successResponse("Get Quotes", await this.quotesService.findAll(userId, query));
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.sharedService.successResponse("Get Quote", await this.quotesService.findOne(id));
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async update(@Req() req, @Param("id") id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.sharedService.successResponse("Update Quote", await this.quotesService.update(req.user.sub, id, updateQuoteDto));
  }

  @Put(":id/react")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async react(@Req() req, @Param("id") id: string) {
    return this.sharedService.successResponse("React Quote", await this.quotesService.react(req.user.sub, id));
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async remove(@Req() req, @Param("id") id: string) {
    return this.sharedService.successResponse("Delete Quote", await this.quotesService.remove(req.user.sub, id));
  }
}
