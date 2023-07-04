import { Controller, Get, Post, Put, Body, Param, Delete, Query, Req } from "@nestjs/common";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";
import { SharedService } from "src/shared/shared.service";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";
import { UseGuards } from "@nestjs/common/decorators";
import { AuthorizationGuard } from "src/authz/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { check_permissions, isPublic } from "src/authz/access.decorator";

@Controller("quotes")
@ApiTags("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService, private sharedService: SharedService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async create(@Req() req, @Body() createQuoteDto: CreateQuoteDto) {
    return this.sharedService.successResponse("Quote created", await this.quotesService.create(req.user.sub, createQuoteDto));
  }

  @Get()
  @isPublic()
  @UseGuards(AuthorizationGuard)
  async findAll(@Req() req, @Query() query: PaginationParamsDto) {
    const userId = req?.user?.sub || null;
    const hasPermission = req?.user?.permissions.includes("verify:quotes") ? true : false;
    return this.sharedService.successResponse("Get Quotes", await this.quotesService.findAll(userId, query, hasPermission));
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.sharedService.successResponse("Get Quote", await this.quotesService.findOne(id));
  }

  @Put(":id")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async update(@Req() req, @Param("id") id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    const hasPermission = req?.user?.permissions.includes("edit:quotes") ? true : false;
    return this.sharedService.successResponse("Quote updated", await this.quotesService.update(req.user.sub, id, updateQuoteDto, hasPermission));
  }

  @Put(":id/react")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async react(@Req() req, @Param("id") id: string) {
    return this.sharedService.successResponse("React to quote", await this.quotesService.react(req.user.sub, id));
  }

  @Put(":id/verify")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @check_permissions("verify:quotes")
  async verify(@Req() req, @Param("id") id: string) {
    return this.sharedService.successResponse("Quote verified", await this.quotesService.verify(req.user.sub, id));
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  async remove(@Req() req, @Param("id") id: string) {
    const hasPermission = req?.user?.permissions.includes("delete:quotes") ? true : false;
    return this.sharedService.successResponse("Quote deleted", await this.quotesService.remove(req.user.sub, id, hasPermission));
  }
}
