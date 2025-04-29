import { Request, Response } from "express";

export interface IContractController {
    createNewContract(req:Request,res:Response):Promise<void>
}