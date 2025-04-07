import { ICategoryEntity } from "./category_entity";

export interface PaginatedCategories {
  categories: Pick<ICategoryEntity, "_id" | "name" | "isActive" | "description">[] | [];
  total: number;
  all: number;
}