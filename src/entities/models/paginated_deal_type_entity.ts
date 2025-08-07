import { IDealTypeEntity } from "./deal_type_entity";


export interface PaginatedDealTypes {
  dealTypes: Pick<IDealTypeEntity, "_id" | "name" | "isActive" | "description" | "createdAt">[] | [];
  total: number;
  all: number;
}