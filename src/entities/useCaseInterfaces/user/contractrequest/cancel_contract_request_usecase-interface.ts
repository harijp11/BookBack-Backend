import { Request, Response } from "express";
import { IContractRequestModel } from "../../../../frameworks/database/models/contract_request-model";

export interface ICancelContractRequestUseCase{
    execute(conReqId:string):Promise<IContractRequestModel | null>
}