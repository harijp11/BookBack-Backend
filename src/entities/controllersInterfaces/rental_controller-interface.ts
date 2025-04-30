import { Request, Response } from "express";

export interface IRentalController {
    getRentedOutBooksContract(req:Request,res:Response):Promise<void>
    getBorrowedBooksContract(req:Request,res:Response):Promise<void>

    //admin
    getAdminRentedOutBooksContract(req:Request,res:Response):Promise<void>
}