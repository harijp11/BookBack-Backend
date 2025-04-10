import { injectable,inject } from "tsyringe";
import { IUpdateDealTypeStatusUseCase } from "../../../entities/useCaseInterfaces/admin/dealType/update_deal_type_status_usecase-interface";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { CustomError } from "../../../entities/utils/custom_error";

@injectable()
export class updateDealTypeStatusUseCase implements IUpdateDealTypeStatusUseCase{
    constructor(
      @inject("IDealTypeRepository")
       private _dealTypeRepository:IDealTypeRepository
    ){}

    async execute(_id: string): Promise<void> {
        const dealtype = await this._dealTypeRepository.findById(_id)

       if(!dealtype){
        throw new CustomError("deal type not found",404)
        }
        const status = dealtype?.isActive ? false : true
        await this._dealTypeRepository.findByIdAndUpdateStatus(_id,status)
    }
}