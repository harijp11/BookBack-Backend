import { IBookModel } from "../../../../frameworks/database/models/book_model";
import { PaginatedBooks } from "../../../models/paginated_books_entity";

export interface IGetAllAdminPaginatedBooksUseCase{
     execute( search: string, filter: object, page: number, limit: number): Promise<PaginatedBooks | null>
}