import { injectable } from "tsyringe";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { IDealTypeEntity } from "../../../entities/models/deal_type_entity";
import { DealTypeModel } from "../../../frameworks/database/models/deal_type_model";
import { PaginatedDealTypes } from "../../../entities/models/paginated_deal_type_entity";


injectable()
export class DealTypeRepository implements IDealTypeRepository{

    async findById(dealTypeId:string):Promise<IDealTypeEntity | null>{
        return await DealTypeModel.findOne({_id:dealTypeId})
    }

   async findByName(name:string):Promise<IDealTypeEntity | null>{
       return await DealTypeModel.findOne({
          name:{$regex:new RegExp(`^${name.trim()}$`,"i")}
         })
   }
   async save(name:string,description:string):Promise<IDealTypeEntity | void>{
    return await DealTypeModel.create({name,description})
   }

   async findPaginatedDealType(
    filter: object, 
    skip: number,
    limit: number
  ): Promise<PaginatedDealTypes> {
    const [dealTypes, total, all] = await Promise.all([
      DealTypeModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({createdAt:-1}),
      DealTypeModel.countDocuments(filter),
      DealTypeModel.countDocuments(),
    ]);

    return {
      dealTypes,
      total,
      all,
    };
  }

  async findByIdAndUpdateStatus(dealTypeId:string,status:boolean):Promise<IDealTypeEntity | null>{
   return  await DealTypeModel.findByIdAndUpdate(
    {_id:dealTypeId},
    {isActive:status},
    {new:true}
   )
  }

  async findByIdAndUpdateDealType(dealTypeId:string,name:string,description:string):Promise<IDealTypeEntity | null>{
     return await DealTypeModel.findByIdAndUpdate(
        {_id:dealTypeId},
        {name,description},
        {new:true}
     )
  }
  getAllDealTypes(): Promise<IDealTypeEntity[] | []> {
    return DealTypeModel.find({isActive:true})
  }
 
}