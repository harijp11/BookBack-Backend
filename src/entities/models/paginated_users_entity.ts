import { UserDTO } from "../../shared/dto/users.Dto";

export interface PaginatedUsers {
	user: UserDTO[] |  [];
	total: number;
}
