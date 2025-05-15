import { Paginatednotifications } from "../../../models/paginated_notification_entity";

export interface IFetchAllUserNoticationUseCase{
    execute(userId:string,Filter:object,page:number,limit:number):Promise<Paginatednotifications>
}