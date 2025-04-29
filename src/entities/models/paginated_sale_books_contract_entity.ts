import { ISaleModel } from "../../frameworks/database/models/sale_model";

export interface PaginatedSoldBooksContracts {
    saleBooksContracts: ISaleModel[];
    totalSoldContracts: number;
    totalPages: number;
    currentPage: number;
  }