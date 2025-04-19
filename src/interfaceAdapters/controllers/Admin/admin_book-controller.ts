import { inject, injectable } from "tsyringe";
import { IAdminBookController } from "../../../entities/controllersInterfaces/admin/admin_book_controller-interface";
import { Request, Response } from "express";
import { IBookModel } from "../../../frameworks/database/models/book_model";
import { HTTP_STATUS } from "../../../shared/constants";
import { IGetAllPaginatedBooksUseCase } from "../../../entities/useCaseInterfaces/admin/book/get_all_paginated_books_usecase-interface";

@injectable()
export class AdminBookController implements IAdminBookController{
  constructor(
    @inject("IGetAllPaginatedBooksUseCase")
    private _getAllPaginatedBooks:IGetAllPaginatedBooksUseCase
  ){}
   
async getAllPaginatedBooks(req: Request, res: Response):Promise<void> {
      try {
             const {
               search = "",
               filter = {},
               page = 1,
               limit = 5
             } = req.query as {search?:string,filter?:string,page?:number,limit?:number}
             const Filter = typeof filter === 'string' ? JSON.parse(filter) : filter;
          // console.log("queries",req.query)
         
             const result = await this._getAllPaginatedBooks.execute(
               search,
               Filter,
               Number(page),
               Number(limit)
             );
            //  console.log("resultsss",result)
         
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
  
}