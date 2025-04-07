import { PaginatedCategories } from "../../../models/paginated_category_entity";
export interface IGetAllPaginatedCategoryUseCase {
  execute(
    pageNumber: number,
    pageSize: number,
    searchTerm: string
  ): Promise<PaginatedCategories>;
}
