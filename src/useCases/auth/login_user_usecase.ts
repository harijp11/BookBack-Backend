import { inject, injectable } from "tsyringe";
import { ILoginUserUseCase } from "../../entities/useCaseInterfaces/auth/login_usecase-interface";
import { LoginUserDTO } from "../../shared/dto/userDto";
import { ILoginStrategy } from "./login_startegies/login_startergy_interface";
import { CustomError } from "../../entities/utils/custom_error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IUserEntity } from "../../entities/models/user_entity";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
	private strategies: Record<string, ILoginStrategy>;
	constructor(
		@inject("UserLoginStrategy") private _userLogin: ILoginStrategy,
		 @inject("AdminLoginStrategy") private _adminLogin: ILoginStrategy
	) {
		this.strategies = {
			user: _userLogin,
			admin: _adminLogin
		};
	}

	async execute(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
		const strategy = this.strategies[user.role];
		if (!strategy) {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.FORBIDDEN
			);
		}
		return await strategy.login(user);
	}
}