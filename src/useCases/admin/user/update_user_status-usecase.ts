import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import user from "../../../frameworks/cache/redis_client";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { IUpdateUserStatusUseCase } from "../../../entities/useCaseInterfaces/admin/user/update_user_status_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
	constructor(
		@inject("IUserRepository")
		private userRepository: IUserRepository
	) {}
	async execute(userType: string, userId: any): Promise<void> {
		if (userType === "user") {
			const user = await this.userRepository.findById(userId);

			if (!user) {
				throw new CustomError(
					ERROR_MESSAGES.USER_NOT_FOUND,
					HTTP_STATUS.NOT_FOUND
				);
			}

			const userActive = user.isActive ? false : true

			await this.userRepository.findByIdAndUpdate(userId, {
				isActive: userActive,
			});
		}
	}
}
