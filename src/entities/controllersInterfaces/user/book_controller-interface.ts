import { Request, Response } from "express";
import { SortOrder } from "mongoose";

export interface GetBooksByLocationInput {
    latitude: number;
    longitude: number;
    maxDistance:number
    page?: number;
    limit?: number;
    search?: string; 
    filters?: Record<string, object>;
    sort?:Record<string, SortOrder>
  }

export interface IBookController {
    generateSignatureForBooksUploading(req:Request,res:Response):Promise<void>
    createNewBook(req:Request,res:Response):Promise<void>
    getAllPaginatedBooks(req:Request,res:Response):Promise<void>
    updateBookDetails(req:Request,res:Response):Promise<void>
    updateBookStatus(req:Request,res:Response):Promise<void>
    getAllAvailableUserBooks(req:Request,res:Response):Promise<void>
    getUserBookDetails(req:Request,res:Response):Promise<void>
    getRelatedBooks(req:Request,res:Response):Promise<void>
}