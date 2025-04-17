import { IDealTypeEntity } from "../../../models/deal_type_entity";

export interface IGetAllDealTypesUseCase {
    execute():Promise<IDealTypeEntity[] | []>
}