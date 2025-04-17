import { IUserEntity } from "../../../models/user_entity";

export interface IChangePasswordUseCase {
    execute(_id:string,password:string,newPassword:string):Promise<IUserEntity | void>
}   