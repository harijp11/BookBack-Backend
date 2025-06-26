import { IDealTypeModel } from "../../../frameworks/database/models/deal_type_model";
import { DealTypeUseCaseResponse } from "../../../shared/constants";
import { IDealTypeEntity } from "../../models/deal_type_entity";
import { PaginatedDealTypes } from "../../models/paginated_deal_type_entity";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface IDealTypeRepository extends IBaseRepository<IDealTypeModel,{name:string,description:string}>{
       findByName(name:string):Promise<IDealTypeEntity | null>
       findPaginatedDealType(filter:object,skip:number,limit:number):Promise<PaginatedDealTypes>
       findByIdAndUpdateStatus(dealTypeId:string,status:boolean):Promise<IDealTypeEntity | null>
       // findById(dealTypeId:string):Promise<IDealTypeEntity | null>
       findByIdAndUpdateDealType(_id:string,name:string,description:string):Promise<IDealTypeEntity | null>
       getAllDealTypes():Promise<IDealTypeEntity[] | []>
}