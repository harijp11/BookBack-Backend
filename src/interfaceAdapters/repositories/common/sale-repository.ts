import { injectable } from "tsyringe";
import { ISaleRepository, PaginatedSoldBooksRepo } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { SaleInput } from "../../../entities/models/contract_input_entity";
import { SaleModel } from "../../../frameworks/database/models/sale_model";

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
        .sort({ createdAt: -1 })
        .populate('categoryId', 'name') 
        .populate('ownerId', 'Name')    
        .populate('dealTypeId', 'name'),
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
          query.ownerId = buyerId;
        }
  
      const [soldBooks,count] = await Promise.all([
       SaleModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('categoryId', 'name') 
        .populate('ownerId', 'Name')    
        .populate('dealTypeId', 'name'),
        SaleModel.countDocuments(query)
      ])
  
      
      const result: PaginatedSoldBooksRepo = {
        getSoldBooksContracts: () => soldBooks, 
        count
      };
      
      return result;
    }


}