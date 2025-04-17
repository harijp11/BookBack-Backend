import { inject, injectable } from "tsyringe";
import { IDealTypeController } from "../../../entities/controllersInterfaces/user/deal_type_controller-interface";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants";
import { IGetAllDealTypesUseCase } from "../../../entities/useCaseInterfaces/user/dealtype/get_all_deal_tyoe_usecase.interface";

@injectable()
export class DealTypeController implements IDealTypeController{
    constructor(
        @inject("IGetAllDealTypesUseCase")
        private _getAllDealTypes:IGetAllDealTypesUseCase
    ){}

     async getDealTypes(req: Request, res: Response): Promise<void> {
        const dealtypes = await this._getAllDealTypes.execute()
       res.status(HTTP_STATUS.OK).json({
        success:true,
        message:"Dealtypes fetched successfully",
        dealtypes
       })
    }

}