import { injectable, inject } from "tsyringe";
import { GetBooksByLocationInput, IBookController } from "../../entities/controllersInterfaces/book_controller-interface";
import { Request, Response } from "express";
import {
  ICreateNewBookUseCase,
  INewBookInput,
} from "../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { HTTP_STATUS } from "../../shared/constants";
import { ICloudinarySignatureService } from "../../entities/serviceInterfaces/cloudinary_service-interface";
import { IGetAllPaginatedOwnerBookUseCase } from "../../entities/useCaseInterfaces/user/book/get_all_paginated_owner_books_usecase-interface";
import { IBookModel } from "../../frameworks/database/models/book_model";
import { IBookEntity } from "../../entities/models/book_entity";
import { IUpdateBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/book/update_book_details_usecase-interface";
import { IUpdateBookStatus } from "../../entities/useCaseInterfaces/user/book/update_book_status_usecase-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { IGetAllUserAvailableBooksUseCase } from "../../entities/useCaseInterfaces/user/book/get_all_user_available_books_usecase-interface";
import { CustomError } from "../../entities/utils/custom_error";
import { IGetUserBookDetailsUseCase } from "../../entities/useCaseInterfaces/user/book/get_book_details_usecase-interface";
import { IRelatedBooksUseCase } from "../../entities/useCaseInterfaces/user/book/get_related_book_usecase-interface";
import { IGetAllAdminPaginatedBooksUseCase } from "../../entities/useCaseInterfaces/admin/book/get_all_paginated_books_usecase-interface";
import { CustomRequest } from "../middlewares/auth_middleware";
import { IAddUserNotifyForBook } from "../../entities/useCaseInterfaces/user/book/add_user_notify_for_book_usecase-interface";

@injectable()
export class BookController implements IBookController {
  constructor(
    @inject("ICreateNewBookUseCase")
    private _createNewBookUseCase: ICreateNewBookUseCase,
    @inject("ICloudinarySignatureService")
    private _cloudinarySignatureService: ICloudinarySignatureService,
    @inject("IGetAllPaginatedOwnerBooksUseCase")
    private _getAllPaginatedOwnerBooks: IGetAllPaginatedOwnerBookUseCase,
    @inject("IUpdateBookDetailsUseCase")
    private _updateBookDetailsUseCase: IUpdateBookDetailsUseCase,
    @inject("IUpdateBookStatusUseCase")
    private _updateBookStatusUseCase: IUpdateBookStatus,
    @inject("IGetAllUserAvailableBooks")
    private _getAllUseAvailableBooksUsecase:IGetAllUserAvailableBooksUseCase,
    @inject("IGetUserBookDetailsUseCase")
    private _getUserBookDetailsUseCase:IGetUserBookDetailsUseCase,
    @inject("IRelatedBooksUseCase")
    private _getRelatedBooksUseCase:IRelatedBooksUseCase,
    @inject("IAddUserNotifyForBookUseCase")
    private _addUserNotifyForBook:IAddUserNotifyForBook,

    @inject("IGetAllPaginatedBooksUseCase")
    private _getAllPaginatedBooks:IGetAllAdminPaginatedBooksUseCase
  ) {}

  generateSignatureForBooksUploading = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { folder = "books" } = req.body;

      if (typeof folder !== "string" || folder.trim() === "") {
        res
          .status(400)
          .json({ success: false, message: "Invalid folder name" });
        return;
      }
      const signatureData =
        this._cloudinarySignatureService.generateSignature(folder);

      res.status(200).json({
        success: true,
        data: signatureData,
      });
    } catch (error) {
      console.error("Error generating Cloudinary signature:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate signature for Cloudinary upload",
      });
    }
  };

  async createNewBook(req: Request, res: Response): Promise<void> {
    const data = req.body;

    await this._createNewBookUseCase.execute(data);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "new Book created successfully",
    });
  }

  async getAllPaginatedBooks(req: Request, res: Response): Promise<void> {
    try {
      const {
        ownerId,
        search = "",
        filter = {},
        page = 1,
        limit = 5,
      } = req.query as {
        ownerId?: string;
        search?: string;
        filter?: object;
        page?: number;
        limit?: number;
      };
      const Filter = typeof filter === "string" ? JSON.parse(filter) : filter;
       
    
 
      if (!ownerId) {
        res.status(400).json({
          success: false,
          message: "Owner ID is required",
        });
      }

      const result = await this._getAllPaginatedOwnerBooks.execute(
        ownerId!,
        search,
        Filter,
        Number(page),
        Number(limit)
      );

      const { books, totalBooks, totalPages, currentPage } = result as {
        books: IBookModel[];
        totalBooks: number;
        totalPages: number;
        currentPage: number;
      };

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Books fetched successfully",
        books,
        totalBooks,
        totalPages,
        currentPage,
      });
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async updateBookDetails(req: Request, res: Response): Promise<void> {
    try {
      const data: IBookEntity = req.body;
      const { bookId } = req.query as { bookId: string };

      await this._updateBookDetailsUseCase.execute(data, bookId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Book details updated successfully",
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateBookStatus(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.query as { bookId: string };
      
      await this._updateBookStatusUseCase.execute(bookId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Book status updated successfully",
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async getAllAvailableUserBooks(req: Request, res: Response): Promise<void> {
    try {
      const {
        userId,
        longitude,
        latitude,
        maxDistance,
        page = 1,
        limit = 5,
        search = "",
        filters = {},
        sort = {createdAt:-1}
      } =req.query as unknown as GetBooksByLocationInput
     
     
      const locationBasedFilteredBooks = await this._getAllUseAvailableBooksUsecase.execute({
        userId:userId,
        longitude: Number(longitude),
        latitude: Number(latitude),
        maxDistance: Number(maxDistance) || 5000000,
        page: Number(page),
        limit: Number(limit),
        search,
        filters,
        sort
      });
      
      if (!locationBasedFilteredBooks) {
        throw new CustomError("No books found", 404);
      }
      
      const { books, totalBooks, totalPages, currentPage } = locationBasedFilteredBooks;
      if (!books || totalBooks === undefined || totalPages === undefined || currentPage === undefined) {
        throw new CustomError("Invalid data received", 500);
      }
        res.status(200).json({
          success: true,
          message:"Books fetched successfully",
          books,
          totalPages,
          currentPage,
          totalBooks
        })
    } catch (error) {
      handleErrorResponse(res,error)
    }
  }

   async getUserBookDetails(req: Request, res: Response): Promise<void> {
        try{
          const bookId:string = req.params._id;
         
        const book = await this._getUserBookDetailsUseCase.execute(bookId);

        res.status(HTTP_STATUS.OK).json({
          success: true,
          message: "Book details fetched successfully",
          book
        })
        }catch(error){
          handleErrorResponse(res,error)
        }
  }


 async  getRelatedBooks(req: Request, res: Response): Promise<void> {
   try{
    const catId:string = req.params.catId;

    const userId = (req as CustomRequest)?.user?._id.toString();


    const books = await this._getRelatedBooksUseCase.execute(catId,userId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Related books fetched successfully",
      books
    })
   }catch(error){
     handleErrorResponse(res,error)
   }
  }


  //admin
async getAllAdminPaginatedBooks(req: Request, res: Response):Promise<void> {
  try {
         const {
           search = "",
           filter = {},
           page = 1,
           limit = 5
         } = req.query as {search?:string,filter?:string,page?:number,limit?:number}
         const Filter = typeof filter === 'string' ? JSON.parse(filter) : filter;
  
     
         const result = await this._getAllPaginatedBooks.execute(
           search,
           Filter,
           Number(page),
           Number(limit)
         );
      
     
         const { 
           books,
           totalBooks,
           totalPages,
           currentPage 
         } = result as {
             books: IBookModel[];
             totalBooks: number;
             totalPages: number;
             currentPage: number;
           }
     
         res.status(HTTP_STATUS.OK).json({
           success: true,
           message: "Books fetched successfully",
           books,
           totalBooks,
           totalPages,
           currentPage
         });
       } catch (error) {
         console.error("Error fetching books:", error);
         res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
           success: false,
           message: "Internal Server Error",
         });
       }
}
 
async addUserNotifyForBook(req: Request, res: Response): Promise<void> {
  try{
    const {bookId} = req.params as {bookId:string}
    const userId = (req as CustomRequest)?.user?._id.toString();

    const message = await this._addUserNotifyForBook.execute(bookId,userId)
      if(message === "You successfully added to the book's notify list"){
        res.status(HTTP_STATUS.OK).json({
           success: true,
           message,
         });
      }else{
        res.status(HTTP_STATUS.OK).json({
           success: false,
           message,
         });
      }
  }catch(error){
    handleErrorResponse(res,error)
  }
}

}
