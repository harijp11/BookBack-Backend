// src/entities/mappers/contract_request.mapper.ts

import { IContractRequestPopulated } from "../../../entities/types/IContractRequestMapPopulated";
import { ContractRequestDTO } from "../../dto/contractRequestDto";

export class ContractRequestMapper {
  static toDTO(request: IContractRequestPopulated): ContractRequestDTO {
    return {
    _id: request._id.toString(),
      requesterId: {
        _id: request.requesterId._id,
        Name: request.requesterId.Name,
        email: request.requesterId.email,
      },
      ownerId: {
        _id: request.ownerId._id.toString(),
        Name: request.ownerId.Name,
      },
      bookId: {
        _id: request.bookId._id.toString(),
        name: request.bookId.name,
      },
      requestType: request.request_type,
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  static toDTOs(requests: IContractRequestPopulated[]): ContractRequestDTO[] {
    return requests.map(this.toDTO);
  }
}
