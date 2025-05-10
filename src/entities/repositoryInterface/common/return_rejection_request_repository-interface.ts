import { Schema } from "mongoose";
import { IReturnRejectionRequestModel } from "../../../frameworks/database/models/return_rejection_request_model";
import { IReturnRejectionRequestcreateDTO } from "../../models/return_rejection_request_input_data_entity";

export interface IReturnRejectionRequestRepository{
    create(data:IReturnRejectionRequestcreateDTO):Promise<IReturnRejectionRequestModel | null>

    findAllReturnRejectionRequestAnalysis(baseFilter:object,skip:number,limit:number):Promise<{
        returnRejectionRequest: IReturnRejectionRequestModel[];
        totalReturnRejectionRequest: number;
        topFiveMostComplainted: Array<{
          _id: Schema.Types.ObjectId;
          count: number;
          user: {
            name: string;
            email: string;
          }
        }>;
        topFiveMostComplaintedTo: Array<{
          _id: Schema.Types.ObjectId;
          count: number;
          user: {
            name: string;
            email: string;
          }
        }>;
        totalPages: number;
        currentPage: number;
      }>
}