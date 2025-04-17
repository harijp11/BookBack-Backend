import { IBookModel } from "../../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../../models/book_entity";

export type INewBookInput = Omit<IBookEntity, "_id" | "createdAt" | "updatedAt" | "isActive" | "status" | "createdAt" | "updatedAt">;

export interface ICreateNewBookUseCase {
    execute(bookData:INewBookInput):Promise <IBookModel | null>
}