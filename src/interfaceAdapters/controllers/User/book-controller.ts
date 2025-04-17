import { injectable,inject} from "tsyringe";
import { IBookController } from "../../../entities/controllersInterfaces/user/book_controller-interface";
import { Request, Response } from "express";
import { ICreateNewBookUseCase, INewBookInput } from "../../../entities/useCaseInterfaces/user/book/create_new_book_usecase-interface";
import { HTTP_STATUS } from "../../../shared/constants";
import { ICloudinarySignatureService } from "../../../entities/serviceInterfaces/cloudinary_service-interface";
import { IGetAllPaginatedOwnerBookUseCase } from "../../../entities/useCaseInterfaces/user/book/get_all_paginated_owner_books_usecase-interface";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { IBookEntity } from "../../../entities/models/book_entity";
import { IUpdateBookDetailsUseCase } from "../../../entities/useCaseInterfaces/user/book/update_book_details_usecase-interface";

@injectable()
export class BookController implements IBookController{
    constructor(
        @inject('ICreateNewBookUseCase')
         private _createNewBookUseCase:ICreateNewBookUseCase,
         @inject("ICloudinarySignatureService")
         private _cloudinarySignatureService:ICloudinarySignatureService,
         @inject("IGetAllPaginatedOwnerBooksUseCase")
         private _getAllPaginatedOwnerBooks:IGetAllPaginatedOwnerBookUseCase,
         @inject("IUpdateBookDetailsUseCase")
         private _updateBookDetailsUseCase:IUpdateBookDetailsUseCase
    ){}

    generateSignatureForBooksUploading = async (req: Request, res: Response): Promise<void> => {
        try {
          const { folder = "books" } = req.body;

          if (typeof folder !== "string" || folder.trim() === "") {
            res.status(400).json({ success: false, message: "Invalid folder name" });
            return;
          }
          const signatureData = this._cloudinarySignatureService.generateSignature(folder);
    
          res.status(200).json({
            success: true,
            data: signatureData
          });
        } catch (error) {
          console.error("Error generating Cloudinary signature:", error);
          res.status(500).json({
            success: false,
            message: "Failed to generate signature for Cloudinary upload"
          });
        }
      };



    async createNewBook(req: Request, res: Response): Promise<void> {
        const data = req.body 
       
        await this._createNewBookUseCase.execute(data)  
        res.status(HTTP_STATUS.CREATED).json({
            success:true,
            message:"new Book created successfully",
        })
    }

    async getAllPaginatedBooks(req: Request, res: Response): Promise<void> {
      try {
        const {
          ownerId,
          search = "",
          filter = {},
          page = 1,
          limit = 5
        } = req.query as {ownerId?:string,search?:string,filter?:object,page?:number,limit?:number}
        const Filter = typeof filter === 'string' ? JSON.parse(filter) : filter;

        
        // console.log("req.query of books",req.query,Filter)                             

        if (!ownerId) {
         res.status(400).json({
            success: false,
            message: "Owner ID is required"
          });
        }
    
        const result = await this._getAllPaginatedOwnerBooks.execute(
          ownerId!,
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

   async updateBookDetails(req: Request, res: Response): Promise<void> {
      const data:IBookEntity = req.body 
      const {bookId}= req.query as {bookId:string}

      await this._updateBookDetailsUseCase.execute(data,bookId)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message:"Book details updated successfully"
      })
    }
    


}