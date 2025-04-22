import { PaginatedCategories } from "../../models/paginated_category_entity";
import { ICategoryEntity } from "../../models/category_entity";



export interface ICategoryRepository {
    findByName(name:string):Promise<ICategoryEntity | null>
    save(name:string,description?:string):Promise<ICategoryEntity>
    findPaginatedCategory(filter:object,skip:number,limit:number):Promise<PaginatedCategories>
    findByIdAndUpdateStatus(catId:string,active:boolean):Promise<ICategoryEntity | null>
    findById(catId:string):Promise<ICategoryEntity | null>
    updateCategory(catId:String,name:String,description:String):Promise<ICategoryEntity | void>
    getAllCategories():Promise<ICategoryEntity[] | []>
}