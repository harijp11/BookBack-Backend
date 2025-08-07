import { inject, injectable } from "tsyringe";
import { IGetUserBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/book/get_book_details_usecase-interface";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { CustomError } from "../../../entities/utils/custom_error";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { BOOK_ERROR_RESPONSES, HTTP_STATUS } from "../../../shared/constants";


@injectable()
export class GetUserBookDetailsUseCase implements IGetUserBookDetailsUseCase{
  constructor(
    @inject("IBookRepository")
    private _bookRepository:IBookRepository 
  ){}

  async  execute(bookId: string): Promise<IBookModel | null> {
          
    const book = await this._bookRepository.findByIdFetchWholeDetails(bookId);

    if(!book){
        throw new CustomError(BOOK_ERROR_RESPONSES.BOOKS_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
    }

    if(!book.isActive){
        throw new CustomError(BOOK_ERROR_RESPONSES.BOOK_NOT_AVAILABLE,HTTP_STATUS.BAD_REQUEST)
    }

    return book
  }
}