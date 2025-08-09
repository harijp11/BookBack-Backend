import { inject, injectable } from "tsyringe";
import { ICategoryEntity } from "../../../entities/models/category_entity";
import { CustomError } from "../../../entities/utils/custom_error";
import { IDealTypeRepository } from "../../../entities/repositoryInterface/common/deal_type_repository-interface";
import { IGetAllDealTypesUseCase } from "../../../entities/useCaseInterfaces/user/dealtype/get_all_deal_tyoe_usecase.interface";
import { DEAL_TYPE_ERROR, HTTP_STATUS } from "../../../shared/constants";
import { DealTypeMapper } from "../../../shared/utils/mappers/dealTypeMappers";
import { IDealTypeEntity } from "../../../entities/models/deal_type_entity";


@injectable()
export class GetAllDealTypesUseCase implements IGetAllDealTypesUseCase{
    constructor(
        @inject("IDealTypeRepository")
        private _dealTypeRepository:IDealTypeRepository
        ){}
        async execute(): Promise<Pick<
          IDealTypeEntity,
          "_id" | "name" | "isActive" | "description" | "createdAt"
        >[]> {
            const dealtypes= await this._dealTypeRepository.getAllDealTypes();

            if(!dealtypes){
                throw new CustomError(DEAL_TYPE_ERROR.DEAL_TYPE_NOT_FOUND,HTTP_STATUS.BAD_REQUEST)
            }
            return DealTypeMapper(dealtypes);
        }
}