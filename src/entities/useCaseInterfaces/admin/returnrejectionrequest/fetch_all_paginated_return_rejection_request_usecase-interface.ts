import { ReturnRejectionRequestDTO } from "../../../../shared/dto/returnRejectionRequestDto";

export interface IFetchAllPaginatedReturnRejectionRequestUseCase {
    execute(page:number,limit:number,filter:object):Promise<{ returnRejectionRequest: ReturnRejectionRequestDTO[]; totalReturnRejectionRequest: number; topFiveMostComplainted: Array<{ count: number; user: { name: string; email: string; }; }>; topFiveMostComplaintedTo: Array<{ count: number; user: { name: string; email: string; }; }>; totalPages: number; currentPage: number; }>
}