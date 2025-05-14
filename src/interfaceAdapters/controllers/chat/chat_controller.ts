import { SocketServer } from '../../../frameworks/socket/socket_server';
import { injectable, inject } from 'tsyringe';
import { IChatController } from '../../../entities/controllersInterfaces/chat/chat_controller-interface';
import { ICloudinarySignatureService } from '../../../entities/serviceInterfaces/cloudinary_service-interface';
import { Request, Response } from 'express';
import { ISocketServer } from '../../../entities/socket/socket_server-interface';
import { CustomRequest } from '../../middlewares/auth_middleware';
import { handleErrorResponse } from '../../../shared/utils/errorHandler';
import { HTTP_STATUS } from '../../../shared/constants';
import { IFetchChatListUseCase } from '../../../entities/useCaseInterfaces/user/chat/fetch_chat_list_usecase-interface';

@injectable()
export class ChatController implements IChatController {
  constructor(
    // @inject("ISocketServer") private _socketServer: ISocketServer,
    @inject("ICloudinarySignatureService")
        private _cloudinarySignatureService: ICloudinarySignatureService,
        @inject("IFetchChatListUseCase")
        private _fetchChatListUseCase:IFetchChatListUseCase
  ) {}
    generateSignatureForBooksUploading = async (
      req: Request,
      res: Response
    ): Promise<void> => {
      try {
        const { folder = "chats" } = req.query as {folder?:string}
  
        if (typeof folder !== "string" || folder.trim() === "") {
          res.status(200).json({ success: false, message: "Invalid folder name" });
          return;
        }
        const signatureData =
          this._cloudinarySignatureService.generateSignature(folder);
  
        res.status(200).json({
          success: true,
          data: signatureData,
        });
      } catch (error) {
        console.error("Error generating Cloudinary signature:", error);
        res.status(500).json({
          success: false,
          message: "Failed to generate signature for Cloudinary upload",
        });
      }
    };

   async fetchChatList(req: Request, res: Response): Promise<void> {
      try{    
        const userId = (req as CustomRequest).user._id.toString()
         const chatList = await this._fetchChatListUseCase.execute(userId)

         if(!chatList || chatList.length === 0){
          res.status(HTTP_STATUS.OK).json({
            success:false,
            message:"no chats available",
            chatList:[]
          })
          return
         }
         res.status(HTTP_STATUS.OK).json({
          success:true,
          message:"Chats fetched successfully",
          chatList
        })
      }catch(error){
        handleErrorResponse(res,error)
      }
    }
    
}