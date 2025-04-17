import { inject, injectable } from "tsyringe";
import { ICreateNewBookUseCase, INewBookInput } from "../../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { IBookModel } from "../../../frameworks/database/models/book_model";



@injectable()
export class CreateNewBookUseCase implements ICreateNewBookUseCase{
    constructor(
        @inject("IBookRepository")
        private _bookRepository:IBookRepository
    ){}
    async execute(bookData: INewBookInput): Promise<IBookModel | null> {
      return await this._bookRepository.createNewCategory(bookData)
    }
}