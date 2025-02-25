import { Category } from "../../data/mongo/models/category.model";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await Category.findOne({
      name: createCategoryDto.name,
    });
    if (categoryExists) throw CustomError.badRequest("Category already exists");

    try {
      const category = new Category({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServerError("Internal Server Error");
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {

      const [total, categories] = await Promise.all([
        Category.countDocuments(),
        Category.find()
        .skip((page - 1) * limit)
        .limit(limit)
      ])

      return {
        page,
        limit,
        total,
        next: `api/categories?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `api/categories?page=${page - 1}&limit=${limit}` : null,
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      throw CustomError.internalServerError("Internal Server Error");
    }
  }
}
