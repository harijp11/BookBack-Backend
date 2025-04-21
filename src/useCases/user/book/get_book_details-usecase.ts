import { inject, injectable } from "tsyringe";
import { IGetUserBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/book/get_book_details_usecase-interface";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { CustomError } from "../../../entities/utils/custom_error";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";


@injectable()
export class GetUserBookDetailsUseCase implements IGetUserBookDetailsUseCase{
  constructor(
    @inject("IBookRepository")
    private _bookRepository:IBookRepository 
  ){}

  async  execute(bookId: string): Promise<IBookModel | null> {
          
    const book = await this._bookRepository.findByIdFetchWholeDetails(bookId);

    if(!book){
        throw new CustomError("Book not found",404)
    }

    if(!book.isActive){
        throw new CustomError("book is not available now",400)
    }

    return book
  }
}