import { IUserEntity } from "../../../models/user_entity";

export interface IFetchReceiverDetailsUseCase{
    execute(receiverId: string): Promise<IUserEntity | null>
}