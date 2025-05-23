import { inject, injectable } from "tsyringe";
import { ICategoryEntity } from "../../../entities/models/category_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { IGetAllDealTypesUseCase } from "../../../entities/useCaseInterfaces/user/dealtype/get_all_deal_tyoe_usecase.interface";


@injectable()
export class GetAllDealTypesUseCase implements IGetAllDealTypesUseCase{
    constructor(
        @inject("IDealTypeRepository")
        private _dealTypeRepository:IDealTypeRepository
        ){}
        async execute(): Promise<ICategoryEntity[] | []> {
            const dealtypes= await this._dealTypeRepository.getAllDealTypes();

            if(!dealtypes){
                throw new CustomError("No dealtypes avaialable",400)
            }
            return dealtypes;
        }
}