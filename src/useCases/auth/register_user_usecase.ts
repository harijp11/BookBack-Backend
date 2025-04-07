import { inject, injectable } from "tsyringe";
import { IRegisterStrategy } from "./register_stratergies/register_startegy_interface";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register_usecase-interface";
import { UserDTO } from "../../shared/dto/userDto";
import { IUserEntity } from "../../entities/models/user_entity";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  private strategies: Record<string, IRegisterStrategy>;

  constructor(
    @inject("UserRegisterStrategy")
    private clientRegister: IRegisterStrategy,
    // @inject("AdminRegisterStrategy")
    // private adminRegister: IRegisterStrategy,
  
  ) {
    this.strategies = {
      user: this.clientRegister,
    //   admin: this.adminRegister,
    };
  }

  async execute(user: UserDTO): Promise<IUserEntity | null> {
    console.log("Received Role:", user.role);
    console.log("Available Strategies:", Object.keys(this.strategies));

    const strategy = this.strategies[user.role];
    if (!strategy) {
      throw new CustomError(
        ERROR_MESSAGES.INVALID_ROLE,
        HTTP_STATUS.FORBIDDEN
      );
    }

    const registeredUser = await strategy.register(user);
    return registeredUser || null; // Returns IUserEntity or null
  }
}