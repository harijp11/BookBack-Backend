import { IRentModel } from "../../../frameworks/database/models/rent_model";
import { RentalInput } from "../../models/contract_input_entity";
import { IRentPopulated } from "../../types/IRentMapPopulated";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface PaginatedRentedBooksRepo {
  getRentedBooksContracts(): IRentPopulated[];
  count: number;
}

export interface IRentRepository extends IBaseRepository<IRentModel,RentalInput> {

  findById(rentalId:string):Promise<IRentModel | null >
  // createNewRent(data: RentalInput): Promise<void>;
  findRentedBooksContracts(
    ownerId: string,
    filter: object,
    limit: number,
    skip: number
  ): Promise<PaginatedRentedBooksRepo | null>;

  findBorrowedBooksContracts(
    borrowerId: string,
    filter: object,
    limit: number,
    skip: number
  ): Promise<PaginatedRentedBooksRepo | null>;

  findAllRentedBooksContracts(
    filter: object,
    limit: number,
    skip: number
  ): Promise<PaginatedRentedBooksRepo | null>;

  findRentedOutBookDetails(rentalId: string): Promise<IRentModel | null>;

  findByIdAndUpdateStatus(rentalId: string,status:string):Promise<IRentModel | null>

//  save(rentalContract:IRentModel):Promise<void>

 count(filter: object): Promise<number>;
  aggregate(pipeline: any[]): Promise<any[]>;
}
