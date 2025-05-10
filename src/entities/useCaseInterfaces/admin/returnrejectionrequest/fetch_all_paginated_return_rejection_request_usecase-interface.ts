import { IReturnRejectionRequestModel } from "../../../../frameworks/database/models/return_rejection_request_model";

export interface IFetchAllPaginatedReturnRejectionRequestUseCase {
    execute(page:number,limit:number,filter:object):Promise<{ returnRejectionRequest: IReturnRejectionRequestModel[]; totalReturnRejectionRequest: number; topFiveMostComplainted: Array<{ count: number; user: { name: string; email: string; }; }>; topFiveMostComplaintedTo: Array<{ count: number; user: { name: string; email: string; }; }>; totalPages: number; currentPage: number; }>
}