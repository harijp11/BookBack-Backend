import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login_startergy_interface";
import { IAdminRepository } from "../../../entities/repositoryInterface/admin/admin_repository-interface";
import { IBcrypt } from "../../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dto/userDto";
import { IUserEntity } from "../../../entities/models/user_entity";

@injectable()
export class AdminLoginStrategy implements ILoginStrategy {
  constructor(
    @inject("IAdminRepository") private adminRepository: IAdminRepository,
    @inject("IPasswordBcrypt") private passwordBcrypt: IBcrypt
  ) {}

  async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
    const admin = await this.adminRepository.findByEmail(user.email);

    console.log("admin details",admin,user.email)
    if (!admin) {
      throw new CustomError(
        ERROR_MESSAGES.EMAIL_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    if (user.password) {
      const isPasswordMatch = await this.passwordBcrypt.compare(
        user.password,
        admin.password
      );
      if (!isPasswordMatch) {
        throw new CustomError(
          ERROR_MESSAGES.INVALID_CREDENTIALS,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return admin;
  }
}
