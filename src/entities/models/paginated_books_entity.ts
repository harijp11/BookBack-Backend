import { IMapBookEntity } from "../types/IBookMapEnitity";
import { IBookEntity } from "./book_entity";

export interface PaginatedBooks {
    books: IMapBookEntity[];
    totalBooks: number;
    totalPages: number;
    currentPage: number;
  }