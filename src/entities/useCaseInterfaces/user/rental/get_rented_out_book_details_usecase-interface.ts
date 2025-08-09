import { SingleRentDTO } from "../../../../shared/dto/singleRentDto";

export interface IGetRentedOutBookDetailsUseCase {
    execute(rentalId:string):Promise<SingleRentDTO | null>
}  