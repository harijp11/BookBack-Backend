import { injectable } from "tsyringe";
import { IRentRepository, PaginatedRentedBooksRepo } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { RentalInput } from "../../../entities/models/contract_input_entity";
import { IRentModel, RentModel } from "../../../frameworks/database/models/rent_model";

@injectable()
export class RentRepository implements IRentRepository {

  async findById(rentalId: string): Promise<IRentModel | null> {
    return RentModel.findOne({_id:rentalId})
  }
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

      async findRentedOutBookDetails(rentalId: string): Promise<IRentModel | null> {
        return await RentModel.findOne({_id:rentalId}).populate('bookId').populate('borrowerId').populate('ownerId')
      }

      async findByIdAndUpdateStatus(rentalId: string, status: string): Promise<IRentModel | null> {
          return await RentModel.findByIdAndUpdate(
            {_id:rentalId},
            {$set:{status}},
            {new:true}
          )
      }

     async save(rentalContract:IRentModel):Promise<void>{
       await rentalContract.save()
     }

     async count(filter: object): Promise<number> {
        return await RentModel.countDocuments(filter);
    }
  
    async aggregate(pipeline: any[]): Promise<any[]> {
        return await RentModel.aggregate(pipeline);
    }


}