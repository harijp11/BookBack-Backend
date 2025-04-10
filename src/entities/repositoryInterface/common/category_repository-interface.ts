import { PaginatedCategories } from "../../models/paginated_category_entity";
import { ICategoryEntity } from "../../models/category_entity";
import { ICategoryModel } from "../../../frameworks/database/models/category_model";


export interface ICategoryRepository {
    findByName(name:string):Promise<ICategoryEntity | null>
    save(name:string,description?:string):Promise<ICategoryEntity>
    findPaginatedCategory(filter:string,skip:number,limit:number):Promise<PaginatedCategories>
    findByIdAndUpdateStatus(_id:string,active:boolean):Promise<ICategoryEntity | null>
    findById(_id:string):Promise<ICategoryEntity | null>
    updateCategory(__id:String,name:String,description:String):Promise<ICategoryEntity | void>
}