import { inject, injectable } from "tsyringe";
import { IRegisterStrategy } from "./register_startegy_interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { ClientDTO,UserDTO } from "../../../shared/dto/userDto";
import { IBcrypt } from "../../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { generateUniqueId } from "../../../frameworks/security/uniqueid_bcrypt";

import { IUserModel } from "../../../frameworks/database/models/User_model";

@injectable()
export class UserRegisterStrategy implements IRegisterStrategy {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IPasswordBcrypt") private passwordBcrypt: IBcrypt,
  ) {}

  async register(user: UserDTO): Promise<IUserModel | void | null> {
    if (user.role === "user") {
      const existingUser = await this.userRepository.findByEmail(
        user.email
      );
      if (existingUser) {
        throw new CustomError(
          ERROR_MESSAGES.EMAIL_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }

      const { Name, phoneNumber, password, email } =
        user as ClientDTO;

      let hashedPassword = null;

      if (password) {
        hashedPassword = await this.passwordBcrypt.hash(password);
      }

      const userId = generateUniqueId();

      const newUser = await this.userRepository.create({
        Name,
        phoneNumber,
        email,
        password: hashedPassword ?? "",
        userId,
        role: "user",
      });
      return newUser 
    } else {
      throw new CustomError(
        "Invalid role for client registration",
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
}