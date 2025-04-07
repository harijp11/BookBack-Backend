import { Request,Response } from "express";

export  interface IAdminDealTypeController {
      createDealType(req:Request,res:Response):Promise<void>;
      getAllPaginatedDealTypes(req:Request,res:Response):Promise<void>
      updateDealTypeStatus(req:Request,res:Response):Promise<void>
      updateDealType(req:Request,res:Response):Promise<void>
}