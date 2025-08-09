// src/application/mappers/user.mapper.ts
import { IUserEntity } from "../../../entities/models/user_entity";
import { UserDTO } from "../../dto/users.Dto";

export class UserMapper {
  static toDTO(user: IUserEntity): UserDTO {
    return {
      _id: user._id.toString(),
      userId: user.userId,
      Name: user.Name,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  }

  static toDTOs(users: IUserEntity[]): UserDTO[] {
    return users.map(user => this.toDTO(user));
  }
}
