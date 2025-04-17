
import { ICategoryEntity } from "../../../models/category_entity";

export interface IGetAllCategoriesUseCase {
    execute():Promise<ICategoryEntity[] | []>
}