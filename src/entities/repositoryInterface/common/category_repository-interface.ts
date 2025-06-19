import { PaginatedCategories } from "../../models/paginated_category_entity";
import { ICategoryEntity } from "../../models/category_entity";
import { BaseRepository } from "../../../interfaceAdapters/repositories/baseRepo/base_repository";
import { ICategoryModel } from "../../../frameworks/database/models/category_model";



export interface ICategoryRepository extends BaseRepository<ICategoryModel,{name:string,description:string}> {
    findByName(name:string):Promise<ICategoryEntity | null>

    findPaginatedCategory(filter:object,skip:number,limit:number):Promise<PaginatedCategories>
    findByIdAndUpdateStatus(catId:string,active:boolean):Promise<ICategoryEntity | null>
    findById(catId:string):Promise<ICategoryEntity | null>
    updateCategory(catId:String,name:String,description:String):Promise<ICategoryEntity | void>
    getAllCategories():Promise<ICategoryEntity[] | []>
}