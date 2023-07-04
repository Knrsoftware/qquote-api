import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SharedService } from "src/shared/shared.service";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/authz/auth.guard";
import { check_permissions } from "src/authz/access.decorator";

@Controller("categories")
@ApiTags("categories")
export class CategoryController {
  constructor(private categoryService: CategoryService, private sharedService: SharedService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @check_permissions("create:categories")
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.sharedService.successResponse("Category Created", await this.categoryService.createCategory(createCategoryDto));
  }

  @Get()
  async getAll() {
    return this.sharedService.successResponse("Get Category List", await this.categoryService.getCategories());
  }

  @Get(":id")
  async getOne(@Param("id") id: string) {
    return this.sharedService.successResponse("Get Category", await this.categoryService.getCategory(id));
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @check_permissions("delete:categories")
  async deleteOne(@Param("id") id: string) {
    return this.sharedService.successResponse("Category Deleted", await this.categoryService.deleteCategory(id));
  }
}
