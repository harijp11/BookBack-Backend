import { inject, injectable } from "tsyringe";
import { IGetAllUserAvailableBooksUseCase } from "../../../entities/useCaseInterfaces/user/book/get_all_user_available_books_usecase-interface";
import { IBookRepository, PaginatedBooksRepo } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { GetBooksByLocationInput } from "../../../entities/controllersInterfaces/book_controller-interface";
import { PaginatedBooks } from "../../../entities/models/paginated_books_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { Types } from "mongoose";

@injectable()
export class GetAllUserAvailbleBooksUseCase implements IGetAllUserAvailableBooksUseCase{
    constructor(
     @inject("IBookRepository")
     private _bookRepository:IBookRepository
    ){}

   async execute({userId, latitude, longitude, maxDistance, page, limit, 
    search, filters,sort 
}: GetBooksByLocationInput): Promise<PaginatedBooks | null> {

        const Filter = typeof filters === "string" ? JSON.parse(filters) : filters;
        const Sort = typeof sort === "string" ? JSON.parse(sort) : sort;
        const currentPage = page ?? 1;
        const currentLimit = limit ?? 5;
        const skip = (currentPage - 1) * currentLimit;



        const matchStage: Record<string, any> = {};
  
        // Convert categoryId to ObjectId if it exists in filters
        if (filters && filters.categoryId) {
            matchStage.categoryId = new Types.ObjectId(Filter.categoryId);
        }
    
        if (filters && filters.dealTypeId) {
            matchStage.dealTypeId = new Types.ObjectId(Filter.dealTypeId);
            console.error("Invalid dealTypeId format:", filters.dealTypeId)
        }
           
        if (search) {
              matchStage.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
              ];
            }

            if (userId && userId !== "") {
              matchStage["ownerId"] = { $ne: new Types.ObjectId(userId) };
          }

          matchStage["status"] = { $ne: "Sold Out" };
          
            const useDistanceSort = !Sort || Object.keys(Sort).length === 0;
            const transformedSort: Record<string, 1 | -1> = {};
              
            if (Sort) {
              for (const [key, value] of Object.entries(Sort)) {
                if (key === 'distance' && useDistanceSort) continue;
            
                if (typeof value === 'number') {
                  transformedSort[key] = value === 1 || value === -1 ? value : 1;
                } else if (
                  value === 'asc' ||
                  value === 'ascending'
                ) {
                  transformedSort[key] = 1;
                } else if (
                  value === 'desc' ||
                  value === 'descending' ||
                  value === '-1' ||
                  value === -1
                ) {
                  transformedSort[key] = -1;
                } else {
                  transformedSort[key] = 1; // Default fallback
                }
              }
            }


        const locationBasedFilteredBooks = await this._bookRepository.findLocationBasedFilteredBooks(
            latitude,
            longitude,
            maxDistance,
            currentLimit,
            skip,
            matchStage,
            transformedSort
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