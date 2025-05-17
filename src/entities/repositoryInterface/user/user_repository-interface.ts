import { ObjectId } from "mongoose";
import { IUserEntity } from "../../models/user_entity";
import { IUserModel } from "../../../frameworks/database/models/User_model";



export interface IUserBasicInfo {
  _id: ObjectId;
  Name?: string;
  profileImage?: string;
}



export interface IUserRepository {
 findSenderAndReceiver (
  senderId: string,
  receiverId: string
): Promise<{
  sender: IUserBasicInfo | null;
  receiver: IUserBasicInfo | null;
}>


  save(data: Partial<IUserEntity>): Promise<IUserEntity>;

  findByEmail(email: string): Promise<IUserEntity | null>;

  find(
    filter: object,
    skip: number,
    limit: number
  ): Promise<{ user:IUserEntity[] | []; total: number }>;

  findById(userId: string): Promise<IUserEntity | null>;
  updateByEmail(
    email: string,
    updates: Partial<IUserEntity>
  ): Promise<IUserEntity | null>;

  findByIdAndUpdate(
    userId: string,
    updateData: Partial<IUserEntity>
  ): Promise<IUserEntity | null>;

  findByIdAndChangePassword(
    userId:string,
    newPassword:string
  ):Promise<IUserEntity | void>

  findByIdAndChangeOnlineStatus(userId:string,status:string):Promise<IUserModel | null>

}