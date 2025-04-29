import { RentalInput } from "../../models/contract_input_entity";

export interface IRentRepository {
    createNewRent(data:RentalInput):Promise<void>
}