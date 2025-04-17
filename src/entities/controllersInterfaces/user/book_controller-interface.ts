import { Request, Response } from "express";

export interface IBookController {
    generateSignatureForBooksUploading(req:Request,res:Response):Promise<void>
    createNewBook(req:Request,res:Response):Promise<void>
    getAllPaginatedBooks(req:Request,res:Response):Promise<void>
    updateBookDetails(req:Request,res:Response):Promise<void>
}