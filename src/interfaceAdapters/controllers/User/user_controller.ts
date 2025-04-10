import { inject, injectable } from "tsyringe";
import { IUserController } from "../../../entities/controllersInterfaces/user/user_controller-interface";
import { Request, Response } from "express"
import { IUsersEntity } from "../../../entities/models/users_entity";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { IUpdateUserProfileUseCase } from "../../../entities/useCaseInterfaces/user/update_user_profile_usecase-interface";
import { ICloudinarySignatureService } from "../../../entities/serviceInterfaces/cloudinary_service-interface";
import { handleErrorResponse } from "../../../shared/utils/errorHandler";
import { IChangePasswordUseCase } from "../../../entities/useCaseInterfaces/user/change_user_password_usecase-interface";


@injectable()
export class UserController implements IUserController{
  constructor(
    @inject("IUpdateUserProfileUseCase")
    private _updateUserProfileUseCase:IUpdateUserProfileUseCase,
    @inject("ICloudinarySignatureService")
    private _cloudinarySignatureService: ICloudinarySignatureService,
    @inject("IChangePasswordUseCase")
    private _changePasswordUseCase:IChangePasswordUseCase
  ){}

  async generateUploadSignature(req: Request, res: Response): Promise<void> {
    try {
      const folder = req.query.folder?.toString() || "user-profiles";
        
      if (!folder) {
        res.status(400).json({ success: false, message: "Folder is required" });
        return;
      }
  
      const signatureData = this._cloudinarySignatureService.generateSignature(folder);
      console.log("signature",signatureData)
      res.status(200).json({
        success: true,
        data: signatureData,
      });
    } catch (error) {
      console.error("Cloudinary Signature Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate upload signature",
      });
    }
  }


  async updateUserProfile(req: Request, res: Response): Promise<void> {
      const userId = req.params.userId
      const profileData = req.body
      
     console.log(profileData)
     const allowedFields:(keyof Partial<IUsersEntity>)[]=[
       "Name",
       "email",
       "phoneNumber",
       "profileImage",
  ]

  const updates: Partial<IUsersEntity> = {};
  for (const key of allowedFields) {
    if (profileData[key] !== undefined) {
      updates[key] = profileData[key];
    }
  }

  const data =  await this._updateUserProfileUseCase.execute(userId,profileData)

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
    data
  });
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try{
      const {_id} = req.query as {_id:string}
      const {password,newPassword} = req.body as {password:string,newPassword:string}
       
      await this._changePasswordUseCase.execute(_id,password,newPassword)
      res.status(HTTP_STATUS.OK).json({
        success:true,
        messasge:"password successfully updated"
      })
    }catch(err){
      handleErrorResponse(res,err)
    }
  }


}