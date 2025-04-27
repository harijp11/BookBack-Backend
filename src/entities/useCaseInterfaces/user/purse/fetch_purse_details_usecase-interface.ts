import { IPurseModel } from "../../../../frameworks/database/models/purse_model";

export interface IFetchPurseDetailsUseCase{
    execute(userId:string):Promise<IPurseModel | null>
}