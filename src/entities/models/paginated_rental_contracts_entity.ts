import { IRentModel } from "../../frameworks/database/models/rent_model";

export interface PaginatedRentedBooksContracts {
    rentedBooksContracts: IRentModel[];
    totalRentedContracts: number;
    totalPages: number;
    currentPage: number;
  }