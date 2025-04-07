import { ICategoryEntity } from "../../models/category_entity";

export interface IGetAllCategories {
    execute():Promise<ICategoryEntity[] | null>
}