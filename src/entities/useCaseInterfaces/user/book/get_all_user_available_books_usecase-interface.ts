import { GetBooksByLocationInput } from "../../../controllersInterfaces/book_controller-interface";
import { PaginatedBooks } from "../../../models/paginated_books_entity";

export interface IGetAllUserAvailableBooksUseCase{
    execute({
        userId,
        latitude,
        longitude,
        maxDistance,
        page,
        limit,
        search,
        filters,
        sort
    }:GetBooksByLocationInput) : Promise<PaginatedBooks | null>
}