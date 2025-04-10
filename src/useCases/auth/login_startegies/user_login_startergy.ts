import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login_startergy_interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IBcrypt } from "../../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dto/userDto";
import { IUserEntity } from "../../../entities/models/user_entity";

@injectable()
export class UserLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IPasswordBcrypt") private passwordBcrypt: IBcrypt
  ) {}

  async login(User: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const user = await this.userRepository.findByEmail(User.email);
    if (!user) {
      console.log("gonna throw error...");
      throw new CustomError(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (!user.isActive) {
      throw new CustomError(ERROR_MESSAGES.BLOCKED, HTTP_STATUS.FORBIDDEN);
    }

    if (User.password) {
  
      const isPasswordMatch = await this.passwordBcrypt.compare(
        User.password,
        user.password
      );

      if (!isPasswordMatch) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return user;
  }
}