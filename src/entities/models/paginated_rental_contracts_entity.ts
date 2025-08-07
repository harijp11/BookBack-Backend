import { IRentModel } from "../../frameworks/database/models/rent_model";
import { RentDTO } from "../../shared/dto/IRentDto";

export interface PaginatedRentedBooksContracts {
    rentedBooksContracts: RentDTO[];
    totalRentedContracts: number;
    totalPages: number;
    currentPage: number;
  }