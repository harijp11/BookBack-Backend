import { Request, Response } from "express";

export interface IDealTypeController {
    getDealTypes(req:Request,res:Response):Promise<void>;
}