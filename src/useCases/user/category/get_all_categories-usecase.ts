import { inject, injectable } from "tsyringe";
import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { IGetAllCategoriesUseCase } from "../../../entities/useCaseInterfaces/user/category/get_all_categories_usecase-interface";
import { ICategoryEntity } from "../../../entities/models/category_entity";
import { CustomError } from "../../../entities/utils/custom_error";


@injectable()
export class GetAllCategoriesUseCase implements IGetAllCategoriesUseCase{
    constructor(
        @inject("ICategoryRepository")
        private _categoryRepository:ICategoryRepository
        ){}
        async execute(): Promise<ICategoryEntity[] | []> {
            const categories= await this._categoryRepository.getAllCategories();

            if(!categories){
                throw new CustomError("No categories avaialable",400)
            }
            return categories;
        }
}