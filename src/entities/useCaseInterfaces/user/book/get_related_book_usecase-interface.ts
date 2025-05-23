import { IBookModel } from "../../../../frameworks/database/models/book_model";

export interface IRelatedBooksUseCase{
    execute(catId:string,ownerId?:string):Promise<IBookModel[] | []>
}