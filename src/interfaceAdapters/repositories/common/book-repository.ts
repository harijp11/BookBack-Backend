import { injectable } from "tsyringe";
import { IBookRepository, PaginatedBooksRepo } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { INewBookInput } from "../../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { BookModel, IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../../entities/models/book_entity";
import { SortOrder } from "mongoose";


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
    filters?: Record<string, object>,
    sort?: Record<string, SortOrder>
  ): Promise<PaginatedBooksRepo | null> {
    // Use $geoWithin with $centerSphere instead of $near
    const geoQuery = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude], 
            // maxDistance / 6371000  // Convert meters to radians (Earth radius ≈ 6371000m)
            10000000000000000000000
          ]
        }
      }
    };
  
    // const searchFilters: Record<string, any> = {};
  
    const searchQuery = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      }
    : {};
  
    Object.assign(searchQuery, filters || {});
  
    const finalQuery = {
      ...geoQuery,
      ...searchQuery,
    };
  
    const books = await BookModel.find(finalQuery).sort(sort).skip(skip).limit(limit).populate('categoryId', 'name') 
    .populate('ownerId', 'Name')    
    .populate('dealTypeId', 'name');
     
    const count = await BookModel.countDocuments(finalQuery);
    
    return {
      getBooks:() => books,
      count
    } as PaginatedBooksRepo
  }

}