import { PaginatedUsers } from "../../../models/paginated_users_entity";

export interface IGetAllUsersUseCase {
  execute(
    userType: string,
    pageNumber: number,
    pageSize: number,
    searchTerm: string
  ): Promise<PaginatedUsers>;
}
