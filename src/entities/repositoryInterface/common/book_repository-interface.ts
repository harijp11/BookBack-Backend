import { SortOrder } from "mongoose";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../models/book_entity";
import { INewBookInput } from "../../useCaseInterfaces/user/book/create_new_book_usecase-interface";

export interface PaginatedBooksRepo {
  getBooks(): IBookModel[];
  count: number;
}

export interface IBookRepository {
  createNewCategory(data: INewBookInput): Promise<IBookModel | null>;
  getAllPaginatedOwnerBooks(
    ownerId?: string,
    search?: string,
    filter?: object,
    limit?: number,
    skip?: number
  ): Promise<PaginatedBooksRepo | null>;
  getAllPaginatedAdminBooks(
    search?: string,
    filter?: object,
    limit?: number,
    skip?: number
  ): Promise<PaginatedBooksRepo | null>;
  findById(bookId: string): Promise<IBookModel | null>;
  findByIdAndUpdateBook(bookId: string, data: IBookEntity): Promise<void>;
  findByIdAndUpdateStatus(
    bookId: string,
    isActive: boolean
  ): Promise<IBookModel | null>;
  findLocationBasedFilteredBooks(
    latitude: number,
    longitude: number,
    maxDistance: number,
    limit: number,
    skip: number,
    // search?: string,
    filters?: Record<string, object>,
    sort?: Record<string, SortOrder>
  ): Promise<PaginatedBooksRepo | null>;
  findByIdFetchWholeDetails(bookId: string): Promise<IBookModel | null>;
  getRelatedBooks(catId: string): Promise<IBookModel[] | []>;
}
