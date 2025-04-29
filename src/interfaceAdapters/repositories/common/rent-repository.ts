import { injectable } from "tsyringe";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { RentalInput } from "../../../entities/models/contract_input_entity";
import { RentModel } from "../../../frameworks/database/models/rent_model";

@injectable()
export class RentRepository implements IRentRepository {
   async createNewRent(data: RentalInput): Promise<void> {
       await RentModel.create(data)
   }
}