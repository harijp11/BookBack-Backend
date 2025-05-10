import { IRentModel } from "../../../../frameworks/database/models/rent_model";

export interface IUpdateRentalContractStatusUseCase {
    execute(rentalId:string,status:string):Promise<IRentModel | null>
}