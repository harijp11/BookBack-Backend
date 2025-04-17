import { IBookEntity } from "../../../models/book_entity";

export interface IUpdateBookDetailsUseCase {
  execute(data:IBookEntity,bookId:string):Promise<void>
}