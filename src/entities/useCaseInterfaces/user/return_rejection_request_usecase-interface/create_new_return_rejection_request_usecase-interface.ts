import { IReturnRejectionRequestModel } from "../../../../frameworks/database/models/return_rejection_request_model";
import { IReturnRejectionRequestcreateDTO } from "../../../models/return_rejection_request_input_data_entity";

export interface ICreateNewReturnRejectionRequestUseCase {
    execute(data:IReturnRejectionRequestcreateDTO):Promise<IReturnRejectionRequestModel | null>
}