import { Category } from "../../data/mongo/models/category.model";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class CategoryService {
  constructor() {}

  async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ) {
    const categoryExists = await Category.findOne({ name: createCategoryDto.name });
    if (categoryExists) throw CustomError.badRequest('Category already exists');

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
      }
      
    } catch (error) {
      throw CustomError.internalServerError('Internal Server Error');
    }
  }
}