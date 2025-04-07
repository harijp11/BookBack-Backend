import { inject, injectable } from "tsyringe";
import { IRegisterStrategy } from "./register_startegy_interface";
import { IAdminRepository } from "../../../entities/repositoryInterface/admin/admin_repository-interface";
import { AdminDTO,UserDTO } from "../../../shared/dto/userDto";
import { IBcrypt } from "../../../frameworks/security/bcrypt_interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class AdminRegisterStrategy implements IRegisterStrategy {
  constructor(
    @inject("IAdminRepository") private adminRepository: IAdminRepository,
    @inject("IPasswordBcrypt") private passwordBcrypt: IBcrypt,
  ) {}

  async register(user: UserDTO): Promise<void> {
    if (user.role === "admin") {
      const existingAdmin = await this.adminRepository.findByEmail(user.email);
      if (existingAdmin) {
        throw new CustomError(
          ERROR_MESSAGES.EMAIL_EXISTS,
          HTTP_STATUS.CONFLICT
        );
      }

      const { email, password } = user as AdminDTO;

      const hashedPassword = await this.passwordBcrypt.hash(password);

      const admin = await this.adminRepository.save({
        email,
        password: hashedPassword,
        role: "admin",
      });
    } else {
      throw new CustomError(
        "Invalid role for admin registration",
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }
}