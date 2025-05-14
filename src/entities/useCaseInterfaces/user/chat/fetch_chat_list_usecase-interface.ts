import { IChatModel } from "../../../../frameworks/database/models/chat_model";

export interface IFetchChatListUseCase {
    execute(userId:string):Promise<IChatModel[] | []>
}