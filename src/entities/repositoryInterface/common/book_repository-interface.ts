import { SortOrder } from "mongoose";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../models/book_entity";
import { INewBookInput } from "../../useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { IBaseRepository } from "../baseRepo/base_repository-interface";
import { IPopulatedBookModel } from "../../types/IBookMapModel";

export interface PaginatedBooksRepo {
  getBooks(): IPopulatedBookModel[];
  count: number;
}

export interface IBookRepository extends IBaseRepository<IBookModel,INewBookInput> {
  // createNewCategory(data: INewBookInput): Promise<IBookModel | null>;
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
  findByIdAndUpdateLiveStatus(bookId:string,status:string):Promise<void>
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
  getRelatedBooks(catId: string,ownerId?:string): Promise<IBookModel[] | []>;
  findByOwnerId(ownerId:string):Promise<IBookModel | null>
  // save(data:IBookModel):Promise<void>
}
