import { IContractRequestModel } from "../../frameworks/database/models/contract_request-model";

export interface PaginatedContractRequest {
    requests: IContractRequestModel[]
    totalRequests: number;
    totalPages: number;
    currentPage: number;
  }