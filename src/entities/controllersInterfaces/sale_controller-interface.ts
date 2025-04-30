import { Request, Response } from "express";

export interface ISaleController {
    fetchSoldBooksContract(req:Request,res:Response):Promise<void>
    fetchBoughtBooksContract(req:Request,res:Response):Promise<void>


    fetchAdminSoldBooksContract(req:Request,res:Response):Promise<void>
}