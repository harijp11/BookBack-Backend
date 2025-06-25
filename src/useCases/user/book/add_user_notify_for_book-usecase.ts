import { inject, injectable } from "tsyringe";
import { IAddUserNotifyForBook } from "../../../entities/useCaseInterfaces/user/book/add_user_notify_for_book_usecase-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { HTTP_STATUS } from "../../../shared/constants";


@injectable()
export class AddUserNotifyForBookUseCase implements IAddUserNotifyForBook{
    constructor(
      @inject("IBookRepository")
      private _bookRepository:IBookRepository
    )
    {}
    async execute(bookId: string, userId: string): Promise<string | void> {
        let book  = await this._bookRepository.findById(bookId)

        if(!book){
            throw new CustomError("Book not found",HTTP_STATUS.BAD_REQUEST)
        }

        if(book.notifyUsers.includes(userId)){
            book.notifyUsers.splice(book.notifyUsers.indexOf(userId),1)
            await this._bookRepository.save(book) 
            return "You removed from the book's notify list"
        }
        book.notifyUsers.push(userId)
        await this._bookRepository.save(book) 
        return "You successfully added to the book's notify list"
    }
}