import { inject, injectable } from "tsyringe";
import { IFetchReceiverDetailsUseCase } from "../../../entities/useCaseInterfaces/user/chat/fetch_receiver_details_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IUserModel } from "../../../frameworks/database/models/User_model";
import { IUserEntity } from "../../../entities/models/user_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";


@injectable()
export class FetchReceiverDetailsUseCase implements IFetchReceiverDetailsUseCase{
     constructor(
        @inject("IUserRepository")
        private _userRepository:IUserRepository
     ){}

     async execute(receiverId: string): Promise<IUserEntity | null> {
        const receiverDetails = await this._userRepository.findById(receiverId)

        if(!receiverDetails){
            throw new CustomError(ERROR_MESSAGES.RECEIVER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
        }

        return receiverDetails
     }
}