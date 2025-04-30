import { injectable } from "tsyringe";
import { IRentRepository, PaginatedRentedBooksRepo } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { RentalInput } from "../../../entities/models/contract_input_entity";
import { RentModel } from "../../../frameworks/database/models/rent_model";

@injectable()
export class RentRepository implements IRentRepository {
   async createNewRent(data: RentalInput): Promise<void> {
       await RentModel.create(data)
   }

    async findRentedBooksContracts(
         ownerId: string = "",
         filter: object = {},
         limit: number,
         skip: number
       ): Promise<PaginatedRentedBooksRepo | null> {
     
           const query: Record<string,any> = {
             ...filter
           };
   
           if (ownerId !== "") {
             query.ownerId = ownerId;
           }
     
         const [rentedBooksContracts,count] = await Promise.all([
          RentModel.find(query)
           .skip(skip)
           .limit(limit)
           .sort({ createdAt: -1 })
           .populate('borrowerId') 
           .populate('ownerId')    
           .populate('bookId'),
           RentModel.countDocuments(query)
         ])
     
         
         const result: PaginatedRentedBooksRepo = {
            getRentedBooksContracts: () => rentedBooksContracts, 
           count
         };
         return result;
       }
       

      async findBorrowedBooksContracts(borrowerId: string, filter: object, limit: number, skip: number): Promise<PaginatedRentedBooksRepo | null> {
        const query: Record<string,any> = {
            ...filter
          };
  
          if (borrowerId !== "") {
            query.borrowerId = borrowerId;
          }
    
        const [rentedBooksContracts,count] = await Promise.all([
         RentModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('borrowerId') 
          .populate('ownerId')    
          .populate('bookId'),
          RentModel.countDocuments(query)
        ])
    
        
        const result: PaginatedRentedBooksRepo = {
           getRentedBooksContracts: () => rentedBooksContracts, 
          count
        };
        return result;
       }




       async findAllRentedBooksContracts(
        filter: object = {},
        limit: number,
        skip: number
      ): Promise<PaginatedRentedBooksRepo | null> {
    
          const query: Record<string,any> = {
            ...filter
          };
  
        const [rentedBooksContracts,count] = await Promise.all([
         RentModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('borrowerId') 
          .populate('ownerId')    
          .populate('bookId'),
          RentModel.countDocuments(query)
        ])
    
        
        const result: PaginatedRentedBooksRepo = {
           getRentedBooksContracts: () => rentedBooksContracts, 
          count
        };
        return result;
      }
}