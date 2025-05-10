import { Request, Response } from "express";

export interface IReturnRejectionRequestController {
    createNewReturnRejectionRequest(req:Request,res:Response):Promise<void>

    fetchAllPaginatedAdminReturnRequest(req:Request,res:Response):Promise<void>
}