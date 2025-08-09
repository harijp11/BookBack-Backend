import { ISaleModel } from "../../frameworks/database/models/sale_model";
import { SoldBookContractDTO } from "../../shared/dto/saleDto";


export interface PaginatedSoldBooksContracts {
    saleBooksContracts: SoldBookContractDTO[];
    totalSoldContracts: number;
    totalPages: number;
    currentPage: number;
  }