import { inject, injectable } from "tsyringe";
import { IUpdateUserProfileUseCase } from "../../../entities/useCaseInterfaces/user/profile/update_user_profile_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IUsersEntity } from "../../../entities/models/users_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS, USER_MESSAGES } from "../../../shared/constants";


@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase{
    constructor(
        @inject("IUserRepository")
        private _userRepository:IUserRepository,
    ){}

   async  execute(userId: string, profileData: Partial<IUsersEntity>): Promise<IUsersEntity | null> {
        const userExist = await this._userRepository.findById(userId)
        

        if(!userExist){
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }

       return await this._userRepository.findByIdAndUpdate(userId,profileData)
    }
}