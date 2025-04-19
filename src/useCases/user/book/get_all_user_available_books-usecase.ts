import { inject, injectable } from "tsyringe";
import { IGetAllUserAvailableBooksUseCase } from "../../../entities/useCaseInterfaces/user/book/get_all_user_available_books_usecase-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { GetBooksByLocationInput } from "../../../entities/controllersInterfaces/user/book_controller-interface";
import { PaginatedBooks } from "../../../entities/models/paginated_books_entity";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class GetAllUserAvailbleBooksUseCase implements IGetAllUserAvailableBooksUseCase{
    constructor(
     @inject("IBookRepository")
     private _bookRepository:IBookRepository
    ){}

   async execute({ latitude, longitude, maxDistance, page, limit, search, filters,sort }: GetBooksByLocationInput): Promise<PaginatedBooks | null> {

        const Filter = typeof filters === "string" ? JSON.parse(filters) : filters;
        const Sort = typeof sort === "string" ? JSON.parse(sort) : sort;
        const currentPage = page ?? 1;
        const currentLimit = limit ?? 5;
        const skip = (currentPage - 1) * currentLimit;

        const locationBasedFilteredBooks = await this._bookRepository.findLocationBasedFilteredBooks(
            latitude,
            longitude,
            maxDistance,
            currentLimit,
            skip,
            search,
            Filter,
            Sort
    )

       if(!locationBasedFilteredBooks){
        throw new CustomError("not books found",404)
       }

       const {getBooks,count} = locationBasedFilteredBooks

       const books = getBooks()

       if(!books || count === undefined){
        throw new CustomError("not books found",404)
       }
         
       return{ 
        books:books || [],
        totalBooks:count,
        totalPages:Math.ceil(count / currentLimit),
        currentPage:currentPage
    }

    }
}