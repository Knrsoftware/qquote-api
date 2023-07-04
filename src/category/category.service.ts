import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quote } from "src/quotes/schemas/quote.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "./schema/category.schema";

@Injectable()
export class CategoryService {
  constructor(@InjectModel("categories") private categoriesModel: Model<Category>, @InjectModel("quotes") private quotesModel: Model<Quote>) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoriesModel.findOne({ name: createCategoryDto.name });
    if (!category) {
      const create_category = new this.categoriesModel(createCategoryDto);
      return create_category.save();
    }
    return category;
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoriesModel.find();
    const results = await Promise.all(
      categories.map(async category => {
        const total = await this.quotesModel.countDocuments({ category, verified: true });
        const newCategory = category.toObject();
        Object.assign(newCategory, { quotes_count: total });
        return newCategory;
      }),
    );
    results.sort((a, b) => b["quotes_count"] - a["quotes_count"]);
    return results;
  }

  async getCategory(id: string): Promise<Category> {
    return await this.categoriesModel.findById(id);
  }

  async getCategoryByName(name: string): Promise<Category> {
    return await this.categoriesModel.findOne({ name });
  }

  async deleteCategory(id: string): Promise<any> {
    return await this.categoriesModel.deleteOne({ _id: id });
  }
}
