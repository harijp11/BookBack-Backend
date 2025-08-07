
import { inject, injectable } from "tsyringe";
import { IUpdateCategoryUseCase } from "../../../entities/useCaseInterfaces/admin/category/update_category_usecase-interface";
import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { CATEGORY_ERROR, ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateCategoryUseCase implements IUpdateCategoryUseCase{
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository:ICategoryRepository
  ){}
  async execute(id: string, name: string, description: string): Promise<void> {
    const category = await this._categoryRepository.findById(id);

    if(!category) {
        throw new CustomError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
     const catNameExist = await this._categoryRepository.findByName(name)
     if(catNameExist){
      throw new CustomError(ERROR_MESSAGES.CATEGORY_EXISTS,400)
     }

    await this._categoryRepository.updateCategory(id, name, description);
  }
}