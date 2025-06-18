import { inject,injectable } from "tsyringe";

import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IUpdateCategoryStatus } from "../../../entities/useCaseInterfaces/admin/category/update_category_status_usecase-interface";


@injectable()
export class UpdateCategoryStatusUseCase implements IUpdateCategoryStatus{
  constructor(
    @inject("ICategoryRepository")
    private _categoryRepository: ICategoryRepository
  ){}
   
  async execute(_id: string): Promise<void> {
   
   let cat =  await this._categoryRepository.findById(_id);
   if(!cat){
    throw new CustomError(ERROR_MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
   }
   const active = !cat.isActive
  
   await this._categoryRepository.findByIdAndUpdateStatus(_id,active)
  }

}
