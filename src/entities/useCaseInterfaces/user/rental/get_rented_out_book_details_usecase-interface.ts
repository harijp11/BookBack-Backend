import { IRentModel } from "../../../../frameworks/database/models/rent_model";

export interface IGetRentedOutBookDetailsUseCase {
    execute(rentalId:string):Promise<IRentModel | null>
}