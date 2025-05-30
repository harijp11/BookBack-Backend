import { inject, injectable } from "tsyringe";
import { IUpdateBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/book/update_book_details_usecase-interface";
import { IBookEntity } from "../../../entities/models/book_entity";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class UpdateBookDetailsUseCase implements IUpdateBookDetailsUseCase{
   constructor(
    @inject("IBookRepository")
    private _bookRepository:IBookRepository
   ){}

   async execute(data: IBookEntity, bookId: string): Promise<void> {
      const book = await this._bookRepository.findById(bookId);
      if(!book){
        throw new CustomError("book not found for updation",404)
      }
    
      await this._bookRepository.findByIdAndUpdateBook(bookId,data); 
   }
}