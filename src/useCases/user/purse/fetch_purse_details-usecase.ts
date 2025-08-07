import { inject, injectable } from "tsyringe";
import { IFetchPurseDetailsUseCase } from "../../../entities/useCaseInterfaces/user/purse/fetch_purse_details_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { IPurseModel } from "../../../frameworks/database/models/purse_model";
import { IPurseRepository } from "../../../entities/repositoryInterface/user/purse_repository-interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class FetchPurseDetailsUseCase implements IFetchPurseDetailsUseCase{
    constructor(
      @inject("IPurseRepository")
      private _purseRepository:IPurseRepository
    ){}

    async execute(userId: string): Promise<IPurseModel | null> {
        if(!userId){
            throw new CustomError(ERROR_MESSAGES.USER_ID_NOT_AVAILABLE,HTTP_STATUS.NOT_FOUND)
        }

        const purse =  await this._purseRepository.findById(userId)

        if(!purse){
          return await this._purseRepository.create({userId})
        }

        return purse
    }
}