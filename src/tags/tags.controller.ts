import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SharedService } from "src/shared/shared.service";
import { CreateTagsDto } from "./dto/create-tags.dto";
import { TagsService } from "./tags.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/authz/auth.guard";
import { check_permissions } from "src/authz/access.decorator";

@Controller("tags")
@ApiTags("tags")
export class TagsController {
  constructor(private tagsService: TagsService, private sharedService: SharedService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @check_permissions("create:tags")
  async createCategory(@Body() createTagsDto: CreateTagsDto) {
    return this.sharedService.successResponse("Create Tag", await this.tagsService.createTag(createTagsDto));
  }

  @Get()
  async getAll() {
    return this.sharedService.successResponse("Tags List", await this.tagsService.getTags());
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @check_permissions("delete:tags")
  async deleteOne(@Param("id") id: string) {
    return this.sharedService.successResponse("Tags Delete", await this.tagsService.deleteTag(id));
  }
}
