import { IUserEntity } from "../../models/user_entity";
import { TRole } from "../../../shared/constants";

export interface IGoogleUseCase {
	execute(
		credential: string,
		userId: string,
		role: TRole
	): Promise<Partial<IUserEntity>>;
}