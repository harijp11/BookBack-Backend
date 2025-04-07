import { IUserEntity } from "./user_entity";

export interface PaginatedUsers {
	user: IUserEntity[] |  [];
	total: number;
}
