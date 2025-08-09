import { inject, injectable } from "tsyringe";
import { IFetchAllPaginatedReturnRejectionRequestUseCase } from "../../../entities/useCaseInterfaces/admin/returnrejectionrequest/fetch_all_paginated_return_rejection_request_usecase-interface";
import { IReturnRejectionRequestRepository } from "../../../entities/repositoryInterface/common/return_rejection_request_repository-interface";
import { ReturnRejectionRequestMapper } from "../../../shared/utils/mappers/returnRejectionRequestMapper";
import { ReturnRejectionRequestDTO } from "../../../shared/dto/returnRejectionRequestDto";

@injectable()
export class FetchAllPaginatedAdminReturnRejectionRequestUseCase implements IFetchAllPaginatedReturnRejectionRequestUseCase{
    constructor(
        @inject("IReturnRejectionRequestRepository")
        private _returnRejectionRequestRepository:IReturnRejectionRequestRepository
    ){}

    async execute(page: number, limit: number,filter:Object): Promise<{ returnRejectionRequest: ReturnRejectionRequestDTO[]; totalReturnRejectionRequest: number; topFiveMostComplainted: Array<{ count: number; user: { name: string; email: string; }; }>; topFiveMostComplaintedTo: Array<{ count: number; user: { name: string; email: string; }; }>; totalPages: number; currentPage: number; }> {

        const skip = (page - 1) * limit;

        const baseFilter = { ...filter };

        const {topFiveMostComplainted,topFiveMostComplaintedTo,returnRejectionRequest, totalReturnRejectionRequest,
            totalPages,
            currentPage} = await this._returnRejectionRequestRepository.findAllReturnRejectionRequestAnalysis(baseFilter,skip,limit)

                const mappedReturnRequests = returnRejectionRequest.map(ReturnRejectionRequestMapper.toDTO);

        return {
            topFiveMostComplainted,topFiveMostComplaintedTo,
            returnRejectionRequest:mappedReturnRequests,
            totalReturnRejectionRequest,
            totalPages,
            currentPage
        }
    }
}