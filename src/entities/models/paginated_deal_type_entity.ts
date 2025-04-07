import { IDealTypeEntity } from "./deal_type_entity";


export interface PaginatedDealTypes {
  dealTypes: Pick<IDealTypeEntity, "_id" | "name" | "isActive" | "description">[] | [];
  total: number;
  all: number;
}