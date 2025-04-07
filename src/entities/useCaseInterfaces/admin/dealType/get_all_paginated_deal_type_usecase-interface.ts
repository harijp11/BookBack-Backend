import { IDealTypeEntity } from "../../../models/deal_type_entity";
import { PaginatedDealTypes } from "../../../models/paginated_deal_type_entity";

export interface IGetAllPaginatedDealTypesUseCase{
    execute(
        pageNumber: number,
        pageSize: number,
        searchTerm: string
    ):Promise<PaginatedDealTypes>
}