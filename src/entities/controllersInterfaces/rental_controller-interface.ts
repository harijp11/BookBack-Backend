import { Request, Response } from "express";

export interface IRentalController {
    getBooksRentedOutBooks(req:Request,res:Response):Promise<void>
    getBorrowedBooks(req:Request,res:Response):Promise<void>
}