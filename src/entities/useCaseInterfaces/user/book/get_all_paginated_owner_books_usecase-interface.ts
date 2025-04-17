
import { PaginatedBooks } from "../../../models/paginated_books_entity";

export interface IGetAllPaginatedOwnerBookUseCase{
    execute(ownerId:string,search:string, filter:object, page:number, limit:number):Promise<PaginatedBooks | null >
}