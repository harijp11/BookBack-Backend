import { inject, injectable } from "tsyringe";
import { IGetAllPaginatedOwnerBookUseCase } from "../../../entities/useCaseInterfaces/user/book/get_all_paginated_owner_books_usecase-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { PaginatedBooks } from "../../../entities/models/paginated_books_entity";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class GetAllPaginatedOwnerBooks implements IGetAllPaginatedOwnerBookUseCase{
constructor(
    @inject("IBookRepository")
    private _bookRepository:IBookRepository
){}

async execute(ownerId: string, search: string, filter: object, page: number, limit: number): Promise<PaginatedBooks | null> {

    const skip = (page - 1) * limit
    
    const paginatedResult = await this._bookRepository.getAllPaginatedOwnerBooks(
        ownerId,
        search,
        filter,
        limit,
        skip
      );
      
      if (!paginatedResult) {
        throw new Error("Something went wrong fetching books.");
      }
      
      const { getBooks, count } = paginatedResult;
      const books = getBooks();

    if(!books){
        throw new CustomError("No books found ", 404);
    }    
    const totalPages = Math.ceil(count / limit);
    return{ 
        books:books || [],
        totalBooks:count,
        totalPages,
        currentPage:page
    }
 }
}