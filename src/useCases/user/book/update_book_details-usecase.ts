import { inject, injectable } from "tsyringe";
import { IUpdateBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/book/update_book_details_usecase-interface";
import { IBookEntity } from "../../../entities/models/book_entity";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { BOOK_ERROR_RESPONSES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateBookDetailsUseCase implements IUpdateBookDetailsUseCase{
   constructor(
    @inject("IBookRepository")
    private _bookRepository:IBookRepository
   ){}

   async execute(data: IBookEntity, bookId: string): Promise<void> {
      const book = await this._bookRepository.findById(bookId);
      if(!book){
        throw new CustomError(BOOK_ERROR_RESPONSES.BOOKS_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
      }
    
      await this._bookRepository.findByIdAndUpdateBook(bookId,data); 
   }
}