import { IContractRequestModel } from "../../frameworks/database/models/contract_request-model";
import { ContractRequestDTO } from "../../shared/dto/contractRequestDto";

export interface PaginatedContractRequest {
    requests: ContractRequestDTO[]
    totalRequests: number;
    totalPages: number;
    currentPage: number;
  }