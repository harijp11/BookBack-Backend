import { injectable,inject } from "tsyringe";
import { IUpdateDealTypeStatusUseCase } from "../../../entities/useCaseInterfaces/admin/dealType/update_deal_type_status_usecase-interface";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";
import { DEAL_TYPE_ERROR, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class updateDealTypeStatusUseCase implements IUpdateDealTypeStatusUseCase{
    constructor(
      @inject("IDealTypeRepository")
       private _dealTypeRepository:IDealTypeRepository
    ){}

    async execute(_id: string): Promise<void> {
        const dealtype = await this._dealTypeRepository.findById(_id)

       if(!dealtype){
        throw new CustomError(DEAL_TYPE_ERROR.DEAL_TYPE_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
        }
        const status = dealtype?.isActive ? false : true
        await this._dealTypeRepository.findByIdAndUpdateStatus(_id,status)
    }
}