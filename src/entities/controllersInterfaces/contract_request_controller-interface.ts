import { Request, Response } from "express";

export interface IContractRequestController {
    createNewContractRequest(req:Request,res:Response):Promise<void>
    checkBookRequestExist(req:Request,res:Response):Promise<void>
    fetchAllOwnerContractRequests(req:Request,res:Response):Promise<void>
    contractRequestStatusUpdate(req:Request,res:Response):Promise<void>
    fetchRequesterRequest(req:Request,res:Response):Promise<void>
    cancelContractRequest(req:Request,res:Response):Promise<void>
    fetchFixDealDetails(req:Request,res:Response):Promise<void>
}