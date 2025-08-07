import { inject, injectable } from "tsyringe";
import { IUpdateDealTypeUseCase } from "../../../entities/useCaseInterfaces/admin/dealType/update_deal_type_usecase-interface";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { DEAL_TYPE_ERROR } from "../../../shared/constants";

@injectable()
export class UpdateDealTypeUseCase implements IUpdateDealTypeUseCase{
    constructor(
        @inject("IDealTypeRepository")
        private _dealTyepeRepository:IDealTypeRepository
    ){}

    async execute(_id: string, name: string, description: string): Promise<void> {
        const deal = await this._dealTyepeRepository.findByName(name)

        if(deal){
            throw new CustomError(DEAL_TYPE_ERROR.DEAL_TYPE_ALREADY_EXISTS,400)
        }

        await this._dealTyepeRepository.findByIdAndUpdateDealType(_id,name,description) 
    }
}