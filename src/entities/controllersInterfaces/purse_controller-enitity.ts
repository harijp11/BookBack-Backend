import { Request, Response } from "express";

export interface IPurseController {
    fetchPurseDetails(req:Request,res:Response):Promise<void>
    createPaymentIntent(req: Request, res: Response): Promise<void>;
  handleWebhook(req: Request, res: Response): Promise<void>;
}