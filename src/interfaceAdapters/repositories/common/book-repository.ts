import { injectable } from "tsyringe";
import { IBookRepository, PaginatedBooksRepo } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { INewBookInput } from "../../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { BookModel, IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../../entities/models/book_entity";
import { PipelineStage, Types } from "mongoose";


@injectable()
export class BookRepository implements IBookRepository{
  async createNewCategory(bookdata: INewBookInput): Promise<IBookModel | null> {
      return await BookModel.create(bookdata)
  }

  async getAllPaginatedOwnerBooks(
    ownerId: string = "",
    search: string,
    filter: object = {},
    limit: number,
    skip: number
  ): Promise<PaginatedBooksRepo | null> {

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        }
      : {};
  
      const query: Record<string,any> = {
        ...filter,
        ...searchQuery
      };
    
      // Conditionally add ownerId if it's defined and not empty
      if (ownerId !== "") {
        query.ownerId = ownerId;
      }

    const [books,count] = await Promise.all([
     BookModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('categoryId', 'name') 
      .populate('ownerId', 'Name')    
      .populate('dealTypeId', 'name'),
      BookModel.countDocuments(query)
    ])

    
    const result: PaginatedBooksRepo = {
      getBooks: () => books, 
      count
    };
    
    return result;
    
  }


 async getAllPaginatedAdminBooks(search: string, filter: object, limit: number, skip: number): Promise<PaginatedBooksRepo | null> {

  const searchQuery = search
  ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }
  : {};

  const query: object = {
    ...filter,
    ...searchQuery
  };


const [books,count] = await Promise.all([
 BookModel.find(query)
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 })
  .populate('categoryId', 'name') 
  .populate('ownerId', 'Name')    
  .populate('dealTypeId', 'name'),
  BookModel.countDocuments(query)
])
const result: PaginatedBooksRepo = {
  getBooks: () => books, 
  count
};

return result;

}

 async findById(bookId:string):Promise<IBookModel | null> {
    const book = await BookModel.findOne({_id:bookId})
    return book
  }

  async findByIdAndUpdateBook(bookId: string, data: IBookEntity): Promise<void> {
    await BookModel.updateOne({ _id:bookId }, data);
  }

  async findByIdAndUpdateStatus(bookId: string, isActive: boolean): Promise<IBookModel | null> {
    const book = await BookModel.findOneAndUpdate({ _id: bookId }, { isActive },)
    return book
  }
  

  async findByIdAndUpdateLiveStatus(bookId: string, status: string): Promise<void> {
    await BookModel.findByIdAndUpdate(
      {_id:bookId},
      {$set:{status}},
      {new:true}
    )
  }
  

  

  async findLocationBasedFilteredBooks(
    latitude: number,
    longitude: number, 
    maxDistance: number, 
    limit: number,
    skip: number, 
    matchStage?: Record<string, any>, 
    transformedSort?: Record<string, any>
  ): Promise<PaginatedBooksRepo | null> {
  
    try {
      const pipeline: PipelineStage[] = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            distanceField: "distance",
            maxDistance:maxDistance, 
            spherical: true,
            key: "location",
            query: matchStage,
            distanceMultiplier: 1,
            includeLocs: "location",
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryId'
          }
        },
        {
          $unwind: {
            path: "$categoryId",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'ownerId'
          }
        },
        {
          $unwind: {
            path: "$ownerId",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'dealtypes',
            localField: 'dealTypeId',
            foreignField: '_id',
            as: 'dealTypeId'
          }
        },
        {
          $unwind: {
            path: "$dealTypeId",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            "dealTypeId.isActive": true,
            "categoryId.isActive": true,
            "isActive":true,
          }
        }
      ];
     
      if (transformedSort && Object.keys(transformedSort).length > 0) {
        pipeline.push({
          $sort: transformedSort
        });
      }
  
      pipeline.push(
        { $skip: skip },
        { $limit: limit }
      );
  
      const countPipeline = [
        ...pipeline.slice(0, -2),
        { $count: "total" }
      ];
  
      const countResult = await BookModel.aggregate(countPipeline);
      const count = countResult.length > 0 ? countResult[0].total : 0;
  
      const books = await BookModel.aggregate(pipeline);

      return {
        getBooks: () => books,
        count
      } as PaginatedBooksRepo;
    } catch (error) {
      console.error("Error in findLocationBasedFilteredBooks:", error);
      return {
        getBooks: () => [],
        count: 0
      } as PaginatedBooksRepo;
    }
  }

   async findByIdFetchWholeDetails(bookId: string): Promise<IBookModel | null> {
       return await BookModel.findById(bookId).populate('categoryId', 'name').populate('ownerId', 'Name').populate('dealTypeId','name')
  }

  async getRelatedBooks(catId: string,ownerId?:string): Promise<IBookModel[] | []> {
    const query:{categoryId:string,ownerId?:string} = {
      categoryId: catId
    }
    if(ownerId){
       query.ownerId = ownerId
    }
    const books = await BookModel.find(query)
    return books 
  } 


  async findByOwnerId(ownerId: string): Promise<IBookModel | null> {
    return await BookModel.findOne({ownerId})
  }

}