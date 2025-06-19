import { inject, injectable } from "tsyringe";
import { IFetchPurseDetailsUseCase } from "../../../entities/useCaseInterfaces/user/purse/fetch_purse_details_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IPurseModel } from "../../../frameworks/database/models/purse_model";
import { IPurseRepository } from "../../../entities/repositoryInterface/user/purse_repository-interface";

@injectable()
export class FetchPurseDetailsUseCase implements IFetchPurseDetailsUseCase{
    constructor(
      @inject("IPurseRepository")
      private _purseRepository:IPurseRepository
    ){}

    async execute(userId: string): Promise<IPurseModel | null> {
        if(!userId){
            throw new CustomError("No userId provided",400)
        }

        const purse =  await this._purseRepository.findById(userId)

        if(!purse){
          return await this._purseRepository.create({userId})
        }

        return purse
    }
}