import { Request ,Response } from "express";

export interface IAdminBookController {
    getAllPaginatedBooks(req:Request,res:Response):Promise<void>
}