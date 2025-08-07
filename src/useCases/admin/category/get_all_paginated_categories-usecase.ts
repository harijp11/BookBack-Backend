import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedCategoryUseCase } from "../../../entities/useCaseInterfaces/admin/category/get_all_paginated_categories_usecase-interface";
import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { PaginatedCategories } from "../../../entities/models/paginated_category_entity";
import { CategoryMapper } from "../../../shared/utils/mappers/categoryMappers";

@injectable()
export class GetALLPaginatedCategories implements IGetAllPaginatedCategoryUseCase {
    constructor(
        @inject("ICategoryRepository")
        private _categoryRepository : ICategoryRepository
    ){}

    async execute(pageNumber: number,
        pageSize: number,
        searchTerm: string): Promise<PaginatedCategories> {
        let filter: {[key:string]:object}= {};
       
        if (searchTerm?.trim()) {
          filter.name = { $regex: searchTerm.trim(), $options: "i" };
        }
    
        const validPageNumber = Math.max(1, pageNumber || 1);
        const validPageSize = Math.max(1, pageSize || 10);
        const skip = (validPageNumber - 1) * validPageSize;
        const limit = validPageSize;
    
        const { categories: rawCategories, total, all } =
          await this._categoryRepository.findPaginatedCategory(filter, skip, limit);
        const response: PaginatedCategories = {
          categories:CategoryMapper(rawCategories),
          total: Math.ceil(total / validPageSize),
          all,
        };
    
        return response;

    }
}