
import { inject, injectable } from "tsyringe";
import { IUpdateCategoryUseCase } from "../../../entities/useCaseInterfaces/admin/category/update_category_usecase-interface";
import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateCategoryUseCase implements IUpdateCategoryUseCase{
  constructor(
    @inject("ICategoryRepository")
    private categoryRepository:ICategoryRepository
  ){}
  async execute(id: string, name: string, description: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);

    if(!category) {
        throw new CustomError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
     const catNameExist = await this.categoryRepository.findByName(name)
     if(catNameExist){
      throw new CustomError("category name already existing",400)
     }

    await this.categoryRepository.updateCategory(id, name, description);
  }
}