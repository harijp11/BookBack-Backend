import { Request, Response } from "express";

export interface IUserController {
    updateUserProfile(req:Request,res:Response):Promise<void>
    generateUploadSignature(req: Request, res: Response): Promise<void>
    changePassword(req:Request,res:Response):Promise<void>
}