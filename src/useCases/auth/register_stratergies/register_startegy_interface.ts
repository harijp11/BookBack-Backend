
import { IUserEntity } from "../../../entities/models/user_entity";
import { UserDTO } from "../../../shared/dto/userDto";

export interface IRegisterStrategy {
  register(user: UserDTO): Promise<IUserEntity | void | null>;
}