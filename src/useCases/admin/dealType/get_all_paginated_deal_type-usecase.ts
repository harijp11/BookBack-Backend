 import { injectable,inject } from "tsyringe";
import { IGetAllPaginatedDealTypesUseCase } from "../../../entities/useCaseInterfaces/admin/dealType/get_all_paginated_deal_type_usecase-interface";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";

import { PaginatedDealTypes } from "../../../entities/models/paginated_deal_type_entity";


@injectable()
export class GetAllPaginatedDealTypesUseCase implements IGetAllPaginatedDealTypesUseCase{
    constructor(
        @inject("IDealTypeRepository")
        private _dealTypeRepository:IDealTypeRepository
    ){}

   async execute(pageNumber:number,pageSize:number,searchTerm:string):Promise<PaginatedDealTypes>{
       
        let filter :any = {}
        if(searchTerm?.trim()){
            filter.name = {$regex:searchTerm.trim(),$options:"i"};
        }

        const validPageNumber = Math.max(1,pageNumber || 1);
        const validPageSize = Math.max(1,pageSize || 10)
        const skip = (validPageNumber-1)*validPageSize
        const limit = validPageSize

        const {dealTypes,total,all} = 
        await this._dealTypeRepository.findPaginatedDealType(filter,skip,limit)
        const response: PaginatedDealTypes = {
            dealTypes,
            total: Math.ceil(total / validPageSize),
            all,
          };
      
          return response;
    }
}