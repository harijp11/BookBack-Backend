import { UserDTO } from "../../../shared/dto/userDto";
import { IUserEntity } from "../../models/user_entity";

export interface IRegisterUserUseCase {
	execute(user: UserDTO): Promise<IUserEntity | null>;
}