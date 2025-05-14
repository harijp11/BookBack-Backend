import { inject, injectable } from "tsyringe";
import { IFetchChatListUseCase } from "../../../entities/useCaseInterfaces/user/chat/fetch_chat_list_usecase-interface";
import { IChatModel } from "../../../frameworks/database/models/chat_model";
import { IChatRepository } from "../../../entities/repositoryInterface/user/chat_repository-interface";

@injectable()
export class FetchChatListUseCase implements IFetchChatListUseCase{
    constructor(
        @inject("IChatRepository")
        private _chatRepository:IChatRepository
    ){}

    async execute(userId: string): Promise<IChatModel[] | []> {
        return await this._chatRepository.findChatByUserId(userId)
    }
}