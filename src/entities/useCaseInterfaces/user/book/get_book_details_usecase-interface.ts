import { IBookModel } from "../../../../frameworks/database/models/book_model";

export interface IGetUserBookDetailsUseCase{
    execute(bookId: string): Promise<IBookModel | null>;
}