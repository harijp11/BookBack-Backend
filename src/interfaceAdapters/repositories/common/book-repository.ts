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
  
      const query: any = {
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

  const query: any = {
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
  

  

  async findLocationBasedFilteredBooks(
    latitude: number,
    longitude: number, 
    maxDistance: number, 
    limit: number,
    skip: number, 
    search?: string, 
    filters?: Record<string, any>, // Allow any type for flexibility
    sort?: Record<string, any>
  ): Promise<PaginatedBooksRepo | null> {
    console.log("Query parameters:", {
      latitude,
      longitude,
      maxDistance,
      limit,
      skip,
      search,
      filters,
      sort
    });
  
    // Force maxDistance to be a number and use a reasonable default if invalid
    const safeMaxDistance = typeof maxDistance === 'number' && !isNaN(maxDistance) 
      ? maxDistance 
      : 5000000; // Default to 5000km if not valid
  
    // Initialize matchStage
    const matchStage: Record<string, any> = {};
  
    // Convert categoryId to ObjectId if it exists in filters
    if (filters && filters.categoryId) {
      try {
        matchStage.categoryId = new Types.ObjectId(filters.categoryId);
      } catch (error) {
        console.error("Invalid categoryId format:", filters.categoryId);
        return {
          getBooks: () => [],
          count: 0
        } as PaginatedBooksRepo;
      }
    }

    if (filters && filters.dealTypeId) {
      try {
        matchStage.dealTypeId = new Types.ObjectId(filters.dealTypeId);
      } catch (error) {
        console.error("Invalid dealTypeId format:", filters.dealTypeId);
        return {
          getBooks: () => [],
          count: 0
        } as PaginatedBooksRepo;
      }
    }
  

    
    // Add search conditions if provided
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
  
    // Handle sorting
    const useDistanceSort = !sort || Object.keys(sort).length === 0;
    const transformedSort: Record<string, 1 | -1> = {};
    if (sort) {
      for (const [key, value] of Object.entries(sort)) {
        if (key === 'distance' && useDistanceSort) {
          continue;
        }
        if (typeof value === 'number') {
          transformedSort[key] = value as 1 | -1;
        } else if (value === 'asc') {
          transformedSort[key] = 1;
        } else if (value === 'desc' || value === -1 || value === '-1') {
          transformedSort[key] = -1;
        } else {
          transformedSort[key] = 1;
        }
      }
    }
  
    let geoNearSort = 1;
    if (sort && 'distance' in sort) {
      const distanceSort = sort.distance;
      if (distanceSort === -1 || distanceSort === '-1') {
        geoNearSort = -1;
      }
    }
  
    try {
      const pipeline: PipelineStage[] = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            distanceField: "distance",
            maxDistance: 500000000, // Use safeMaxDistance
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
            from: 'deals',
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
        }
      ];
  
      if (Object.keys(transformedSort).length > 0) {
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
      console.log("Total books found:", books.length);
      console.log("Applied sort:", transformedSort);
      if (books.length > 0) {
        console.log("Sample book distance:", books[0].distance);
      }
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

  async getRelatedBooks(catId: string): Promise<IBookModel[] | []> {
    console.log("category id found",catId)
    const books = await BookModel.find({categoryId: catId})
    return books 
  } 

}