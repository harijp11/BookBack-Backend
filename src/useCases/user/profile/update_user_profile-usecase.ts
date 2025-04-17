import { inject, injectable } from "tsyringe";
import { IUpdateUserProfileUseCase } from "../../../entities/useCaseInterfaces/user/profile/update_user_profile_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IUsersEntity } from "../../../entities/models/users_entity";
import { CustomError } from "../../../entities/utils/custom_error";


@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase{
    constructor(
        @inject("IUserRepository")
        private _userRepository:IUserRepository,
    ){}

   async  execute(userId: string, profileData: Partial<IUsersEntity>): Promise<IUsersEntity | null> {
        const userExist = await this._userRepository.findById(userId)
        

        if(!userExist){
            throw new CustomError("user not found",404)
        }

       return await this._userRepository.findByIdAndUpdate(userId,profileData)
    }
}