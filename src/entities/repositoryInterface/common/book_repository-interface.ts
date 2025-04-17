import { IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../models/book_entity";
import { INewBookInput } from "../../useCaseInterfaces/user/book/create_new_book_usecase-interface";


export interface PaginatedBooksRepo{
    getBooks(): IBookModel[];
     count:number
}

export interface IBookRepository{
    createNewCategory(data:INewBookInput):Promise<IBookModel | null> 
    getAllPaginatedOwnerBooks(ownerId:string, search:string, filter:object, limit:number,skip:number):Promise<PaginatedBooksRepo | null>
    findById(bookId:string):Promise<IBookModel | null>
    findByIdAndUpdateBook(bookId:string,data:IBookEntity):Promise<void>
}