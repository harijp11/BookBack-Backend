import { IBookModel } from "../../frameworks/database/models/book_model";

export interface PaginatedBooks {
    books: IBookModel[];
    totalBooks: number;
    totalPages: number;
    currentPage: number;
  }