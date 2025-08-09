
import { ICategoryEntity } from "../../../models/category_entity";

export interface IGetAllCategoriesUseCase {
    execute():Promise<Pick<ICategoryEntity, "_id" | "name" | "isActive" | "description" | "createdAt">[] | []>
}