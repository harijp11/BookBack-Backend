import { injectable } from "tsyringe";
import { ISaleRepository, PaginatedSoldBooksRepo } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { SaleInput } from "../../../entities/models/contract_input_entity";
import { ISaleModel, SaleModel } from "../../../frameworks/database/models/sale_model";

@injectable()
export class SaleRepository implements ISaleRepository{
  async createNewSale(data: SaleInput): Promise<void> {
      await SaleModel.create(data)
  }

  async fetchSoldBooksContracts(
      ownerId: string = "",
      filter: object = {},
      limit: number,
      skip: number
    ): Promise<PaginatedSoldBooksRepo | null> {
           console.log("filter",filter)
        const query: Record<string,any> = {
          ...filter
        };

        if (ownerId !== "") {
          query.ownerId = ownerId;
        }
  
      const [soldBooks,count] = await Promise.all([
       SaleModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .populate('buyerId') 
        .populate('ownerId')    
        .populate('bookId'),
        SaleModel.countDocuments(query)
        
      ])
  
      
      const result: PaginatedSoldBooksRepo = {
        getSoldBooksContracts: () => soldBooks, 
        count
      };
      return result;
    }

   async  findBoughtBooksContracts(buyerId: string = "",
      filter: object = {},
      limit: number,
      skip: number
    ): Promise<PaginatedSoldBooksRepo | null> {
  
        const query: Record<string,any> = {
          ...filter
        };

        if (buyerId !== "") {
          query.buyerId = buyerId;
        }
  
      const [soldBooks,count] = await Promise.all([
       SaleModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .populate('buyerId') 
        .populate('ownerId')    
        .populate('bookId'),
        SaleModel.countDocuments(query)
      ])
  
      
      const result: PaginatedSoldBooksRepo = {
        getSoldBooksContracts: () => soldBooks, 
        count
      };
      
      return result;
    }



    async findAllBooks(
      filter: object = {},
      limit: number,
      skip: number
    ): Promise<PaginatedSoldBooksRepo | null> {
  
        const query: Record<string,any> = {
          ...filter
        };

       
  
      const [soldBooks,count] = await Promise.all([
       SaleModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('buyerId') 
        .populate('ownerId')    
        .populate('bookId'),
        SaleModel.countDocuments(query)
      ])
  
      
      const result: PaginatedSoldBooksRepo = {
        getSoldBooksContracts: () => soldBooks, 
        count
      };
      return result;
    }
  

      async findSoldBookDetails(saleContractId: string): Promise<ISaleModel | null> {
            return await SaleModel.findOne({_id:saleContractId}).populate('bookId').populate('buyerId').populate('ownerId')
          }


          async count(filter: object): Promise<number> {
              return await SaleModel.countDocuments(filter)
          }
        
          async aggregate(pipeline: any[]): Promise<any[]>{
              return await SaleModel.aggregate(pipeline)
          }

}