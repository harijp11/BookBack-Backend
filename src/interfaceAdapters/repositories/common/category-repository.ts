import { injectable } from "tsyringe";
 import { ICategoryEntity } from "../../../entities/models/category_entity";
import { categoryModel, ICategoryModel } from "../../../frameworks/database/models/category_model";
import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { PaginatedCategories } from "../../../entities/models/paginated_category_entity";
import { BaseRepository } from "../baseRepo/base_repository";

interface categoryCreateDTO{name:string 
  description:string}

@injectable()
export class CategoryRepository extends BaseRepository<ICategoryModel,categoryCreateDTO> implements ICategoryRepository{
  constructor(){
    super(categoryModel)
  }
    async  findByName(name:string):Promise<ICategoryEntity | null>{   
   return await  categoryModel.findOne({
    name:{$regex:new RegExp(`^${name.trim()}$`,"i")},
   })
    }

     async findPaginatedCategory(
      filter: object, 
      skip: number,
      limit: number
    ): Promise<PaginatedCategories> {
      const [categories, total, all] = await Promise.all([
        categoryModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({createdAt:-1}),
        categoryModel.countDocuments(filter),
        categoryModel.countDocuments(),
      ]);
  
      return {
        categories,
        total,
        all,
      };
    }

    // async findById(_id:string):Promise<ICategoryEntity | null>{
    //  return await categoryModel.findOne({_id})
    // }

    async findByIdAndUpdateStatus(_id:string,active:boolean): Promise<ICategoryEntity | null> {
         return await categoryModel.findByIdAndUpdate(
          _id,
          {$set:{isActive:active}},
          {new:true}
         )
}

async updateCategory(_id:string,name: string, description: string):Promise<ICategoryEntity | void> {
   await categoryModel.findByIdAndUpdate(
    _id,
    { name, description },
    { new: true }
  );
}

async getAllCategories(): Promise<ICategoryEntity[] | []> {
  return await categoryModel.find({isActive:true})
}
}