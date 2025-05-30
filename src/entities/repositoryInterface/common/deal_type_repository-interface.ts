import { DealTypeUseCaseResponse } from "../../../shared/constants";
import { IDealTypeEntity } from "../../models/deal_type_entity";
import { PaginatedDealTypes } from "../../models/paginated_deal_type_entity";

export interface IDealTypeRepository {
       findByName(name:string):Promise<IDealTypeEntity | null>
       save(name:string,description?:string):Promise<IDealTypeEntity | void>
       findPaginatedDealType(filter:object,skip:number,limit:number):Promise<PaginatedDealTypes>
       findByIdAndUpdateStatus(dealTypeId:string,status:boolean):Promise<IDealTypeEntity | null>
       findById(dealTypeId:string):Promise<IDealTypeEntity | null>
       findByIdAndUpdateDealType(_id:string,name:string,description:string):Promise<IDealTypeEntity | null>
       getAllDealTypes():Promise<IDealTypeEntity[] | []>
}