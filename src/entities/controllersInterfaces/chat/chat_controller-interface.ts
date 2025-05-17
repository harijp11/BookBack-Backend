import { Request, Response } from "express";

export interface IChatController {
    generateSignatureForBooksUploading(req:Request,res:Response):Promise<void>
    fetchChatList(req:Request,res:Response):Promise<void>
    fetchReceiverDetails(req:Request,res:Response):Promise<void>
  }