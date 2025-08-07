import { inject, injectable } from "tsyringe";
import { IcreateNewCategoryUseCase } from "../../../entities/useCaseInterfaces/admin/category/create_category_usecase-interface";
import  { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface"
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES } from "../../../shared/constants";



@injectable()
export class CreateNewCategoryUseCase implements IcreateNewCategoryUseCase {
      
    constructor(
        @inject("ICategoryRepository")
        private _categoryRepository:ICategoryRepository
    ){}

    async execute(name: string, description: string): Promise<void> {
        
        const isCategoryExists = await this._categoryRepository.findByName(name)

        if(isCategoryExists){
            throw new CustomError(ERROR_MESSAGES.CATEGORY_EXISTS,400)
        }

        await this._categoryRepository.create({name,description})
    }
}