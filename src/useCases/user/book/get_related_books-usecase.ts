import { inject, injectable } from "tsyringe";
import { IRelatedBooksUseCase } from "../../../entities/useCaseInterfaces/user/book/get_related_book_usecase-interface";
import { IBookRepository } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class GetRelatedBooksUseCase implements IRelatedBooksUseCase{
  constructor(
    @inject("IBookRepository")
    private _bookRepository:IBookRepository
  ){}

  async execute(catId: string,ownerId?:string): Promise<IBookModel[] | []> {
      const relatedBooks = await this._bookRepository.getRelatedBooks(catId,ownerId);
      
      if(!relatedBooks){
        throw new CustomError("No Related Books Found",404)
      }
      return relatedBooks;
  }
}