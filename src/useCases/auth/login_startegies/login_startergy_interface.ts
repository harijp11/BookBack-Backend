import { IUserEntity } from "../../../entities/models/user_entity";
import { LoginUserDTO } from "../../../shared/dto/userDto";

export interface ILoginStrategy {
  login(user: LoginUserDTO): Promise<Partial<IUserEntity>>;
}