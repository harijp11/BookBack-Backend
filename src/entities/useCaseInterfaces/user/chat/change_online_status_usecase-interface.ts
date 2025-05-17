import { IUserModel } from "../../../../frameworks/database/models/User_model";

export interface IChangeOnlineStatusUseCase {
    execute(userId:string,status:string):Promise<IUserModel | null>
}