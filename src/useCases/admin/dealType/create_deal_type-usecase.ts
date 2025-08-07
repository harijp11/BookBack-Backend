import { injectable,inject } from "tsyringe";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { ICreateDealTypeUseCase } from "../../../entities/useCaseInterfaces/admin/dealType/create_deal_type_usecase-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { DEAL_TYPE_ERROR, HTTP_STATUS } from "../../../shared/constants";


@injectable()
export class CreateDealTypeUseCase implements ICreateDealTypeUseCase {
   constructor(
    @inject("IDealTypeRepository")
    private _dealtyperepository:IDealTypeRepository
   ){}

   async execute(name:string,description:string):Promise<void>{
    const isDealTypeExists = await this._dealtyperepository.findByName(name)

    if(isDealTypeExists){
        throw new CustomError(DEAL_TYPE_ERROR.DEAL_TYPE_ALREADY_EXISTS,HTTP_STATUS.BAD_REQUEST)
    }
    await this._dealtyperepository.create({name,description})
   }
}