import { injectable } from "tsyringe";
import { IBookRepository, PaginatedBooksRepo } from "../../../entities/repositoryInterface/common/book_repository-interface";
import { INewBookInput } from "../../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { BookModel, IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../../entities/models/book_entity";


@injectable()
export class BookRepository implements IBookRepository{
  async createNewCategory(bookdata: INewBookInput): Promise<IBookModel | null> {
      return await BookModel.create(bookdata)
  }

  async getAllPaginatedOwnerBooks(
    ownerId: string,
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
  
    const query = {
      ownerId,
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

}