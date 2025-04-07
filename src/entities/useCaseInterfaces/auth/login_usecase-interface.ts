import { LoginUserDTO } from "../../../shared/dto/userDto";
import { IUserEntity } from "../../models/user_entity";

export interface ILoginUserUseCase {
	execute(user: LoginUserDTO): Promise<Partial<IUserEntity>>;
}