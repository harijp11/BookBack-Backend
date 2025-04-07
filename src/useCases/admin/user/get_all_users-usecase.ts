import { inject, injectable } from "tsyringe";
import { PaginatedUsers } from "../../../entities/models/paginated_users_entity";
import { IGetAllUsersUseCase } from "../../../entities/useCaseInterfaces/admin/user/get_all_users_usecase-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject("IClientRepository") private userRepository: IUserRepository,
  ) {}

  async execute(
    userType: string,
    pageNumber: number,
    pageSize: number,
    searchTerm: string
  ): Promise<PaginatedUsers> {
    let filter: any = {};
    if (userType) {
      filter.role = userType; // Already normalized in controller
    }

    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const validPageNumber = Math.max(1, pageNumber);
    const validPageSize = Math.max(1, pageSize);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    if (userType === "user") {
      const { user, total } = await this.userRepository.find(filter, skip, limit);
      return {
        user,
        total: Math.ceil(total / validPageSize),
      };
    }

    throw new CustomError(
      "Invalid user type. Expected 'client' or 'trainer'.",
      HTTP_STATUS.BAD_REQUEST
    );
  }
}