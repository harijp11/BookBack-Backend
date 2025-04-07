import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login_startergy_interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dto/userDto";
import { IUserEntity } from "../../../entities/models/user_entity";

@injectable()
export class ClientGoogleLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IClientRepository") private clientRepository: IUserRepository
  ) {}

  async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const User = await this.clientRepository.findByEmail(user.email);
    if (User) {
      if (!User.isActive) {
        throw new CustomError(ERROR_MESSAGES.BLOCKED, HTTP_STATUS.FORBIDDEN);
      }
    }

    return User as Partial<IUserEntity>;
  }
}