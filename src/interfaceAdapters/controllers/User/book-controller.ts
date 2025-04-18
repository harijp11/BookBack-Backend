import { injectable, inject } from "tsyringe";
import { GetBooksByLocationInput, IBookController } from "../../../entities/controllersInterfaces/user/book_controller-interface";
import { Request, Response } from "express";
import {
  ICreateNewBookUseCase,
  INewBookInput,
} from "../../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { ICloudinarySignatureService } from "../../../entities/serviceInterfaces/cloudinary_service-interface";
import { IGetAllPaginatedOwnerBookUseCase } from "../../../entities/useCaseInterfaces/user/book/get_all_paginated_owner_books_usecase-interface";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../../entities/models/book_entity";
import { IUpdateBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/book/update_book_details_usecase-interface";
import { IUpdateBookStatus } from "../../../entities/useCaseInterfaces/user/book/update_book_status_usecase-interface";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IGetAllUserAvailableBooksUseCase } from "../../../entities/useCaseInterfaces/user/book/get_all_user_available_books_usecase-interface";
import { PaginatedBooks } from "../../../entities/models/paginated_books_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { SortOrder } from "mongoose";

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
    private _getAllUseAvailableBooksUsecase:IGetAllUserAvailableBooksUseCase
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

      // console.log("req.query of books",req.query,Filter)

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
      console.log("query", req.query);
      console.log("paramd", req.params);

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
        longitude,
        latitude,
        maxDistance,
        page = 1,
        limit = 5,
        search = "",
        filters = {},
        sort = {createdAt:-1}
      } =req.query as unknown as GetBooksByLocationInput
     
       
     const sortParam = req.query.sort as Record<string, string>;
     const convertedSort: Record<string, SortOrder> = {};
     
     if (sortParam) {
       Object.keys(sortParam).forEach(key => {
         // Since SortOrder appears to be a string type, we keep the string value
         // But we'll validate it contains only valid values
         const value = sortParam[key];
         
         // Assuming SortOrder accepts "1" or "-1" as string values
         if (value === "1" || value === "-1") {
           convertedSort[key] = 1 as SortOrder;
         } else {
           // Default to "-1" for descending order
           convertedSort[key] = 1 as SortOrder;
         }
       });
     }

     console.log("queriesss",convertedSort)

     
      const locationBasedFilteredBooks = await this._getAllUseAvailableBooksUsecase.execute({
        longitude: Number(longitude),
        latitude: Number(latitude),
        maxDistance: Number(maxDistance),
        page: Number(page),
        limit: Number(limit),
        search,
        filters,
        sort:convertedSort
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
}
