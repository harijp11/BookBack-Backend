import { inject, injectable } from "tsyringe";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/auth/google_auth_usecase-interface";
import { OAuth2Client } from "google-auth-library";
import { IUserEntity } from "../../entities/models/user_entity";
import { ERROR_MESSAGES, HTTP_STATUS, TRole } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom_error";
import { IUserRepository } from "../../entities/repositoryInterface/user/user_repository-interface";
import { UserDTO } from "../../shared/dto/userDto";
import { IRegisterUserUseCase } from "../../entities/useCaseInterfaces/auth/register_usecase-interface";

@injectable()
export class GoogleUseCase implements IGoogleUseCase {
	private _oAuthClient: OAuth2Client;
	constructor(
		@inject("IRegisterUserUseCase")
		private _registerUserUseCase: IRegisterUserUseCase,
		@inject("IClientRepository")
		private _clientRepository: IUserRepository,
	) {
		this._oAuthClient = new OAuth2Client();
	}

	async execute(
		credential: string,
		client_id: string,
		role: TRole
	): Promise<Partial<IUserEntity>> {
		const ticket = await this._oAuthClient.verifyIdToken({
			idToken: credential,
			audience: client_id,
		});

		const payload = ticket.getPayload();
		if (!payload) {
			throw new CustomError(
				"Invalid or empty token payload",
				HTTP_STATUS.UNAUTHORIZED
			);
		}

		const googleId = payload.sub;
		const email = payload.email;
		const Name = payload.given_name || "";
    
		

		if (!email) {
			throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
		}

		let repository;
		if (role === "user") {
			repository = this._clientRepository;
		} else {
			throw new CustomError(
				ERROR_MESSAGES.INVALID_ROLE,
				HTTP_STATUS.BAD_REQUEST
			);
		}

		const existingUser = await repository.findByEmail(email);

		if (existingUser && !existingUser.isActive) {
			throw new CustomError(
				ERROR_MESSAGES.BLOCKED,
				HTTP_STATUS.FORBIDDEN
			);
		}

		if (existingUser) return existingUser;

		const newUser = await this._registerUserUseCase.execute({
			Name,
			role,
			googleId,
			email,
		} as UserDTO);

		if (!newUser) {
			throw new CustomError(
				"Registration failed",
				HTTP_STATUS.INTERNAL_SERVER_ERROR
			);
		}

		return newUser;
	}
}