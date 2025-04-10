import { IUsersEntity } from "../../models/users_entity";

export interface IUpdateUserProfileUseCase {
    execute(userId:string, profileData: Partial<IUsersEntity>):Promise<IUsersEntity | null>
}