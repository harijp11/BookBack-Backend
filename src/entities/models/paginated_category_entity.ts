import { ICategoryEntity } from "./category_entity";

export interface PaginatedCategories {
  categories: Pick<ICategoryEntity, "_id" | "name" | "isActive" | "description" | "createdAt">[] | [];
  total: number;
  all: number;
}