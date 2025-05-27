import { inject, injectable } from "tsyringe";
import { IChangeOnlineStatusUseCase } from "../../../entities/useCaseInterfaces/user/chat/change_online_status_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";


@injectable()
export class ChangeOnlineStatusUseCase implements IChangeOnlineStatusUseCase{
  constructor(
    @inject("IUserRepository")
    private _userRepository:IUserRepository
  ){}
  async execute(userId: string, status: string): Promise<void> {
    await this._userRepository.findByIdAndChangeOnlineStatus(userId,status) 
     
  }
}