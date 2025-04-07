import { PaginatedCategories } from "../../models/paginated_category_entity";
import { ICategoryEntity } from "../../models/category_entity";


export interface ICategoryRepository {
    findByName(name:string):Promise<ICategoryEntity | null>
    save(name:string,description?:string):Promise<ICategoryEntity>
    findPaginatedCategory(filter:any,skip:number,limit:number):Promise<PaginatedCategories>
    findByIdAndUpdateStatus(_id:any):Promise<ICategoryEntity | null>
    findById(_id:any):Promise<ICategoryEntity | null>
    updateCategory(__id:String,name:String,description:String):Promise<ICategoryEntity | void>
}