import { inject, injectable } from "tsyringe";
import { IDealTypeController } from "../../entities/controllersInterfaces/deal_type_controller-interface";
import { Request, Response } from "express";
import { DEAL_TYPE_SUCCESS, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IGetAllDealTypesUseCase } from "../../entities/useCaseInterfaces/user/dealtype/get_all_deal_tyoe_usecase.interface";
import { ICreateDealTypeUseCase } from "../../entities/useCaseInterfaces/admin/dealType/create_deal_type_usecase-interface";
import { IGetAllPaginatedDealTypesUseCase } from "../../entities/useCaseInterfaces/admin/dealType/get_all_paginated_deal_type_usecase-interface";
import { IUpdateDealTypeStatusUseCase } from "../../entities/useCaseInterfaces/admin/dealType/update_deal_type_status_usecase-interface";
import { IUpdateDealTypeUseCase } from "../../entities/useCaseInterfaces/admin/dealType/update_deal_type_usecase-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";

@injectable()
export class DealTypeController implements IDealTypeController {
  constructor(
    @inject("IGetAllDealTypesUseCase")
    private _getAllDealTypes: IGetAllDealTypesUseCase,

  
    @inject("ICreateDealTypeUseCase")
    private _createDealTypeUseCase: ICreateDealTypeUseCase,
    @inject("IGetAllPaginatedDealTypesUseCase")
    private _getAllPaginatedDealTypesUseCase: IGetAllPaginatedDealTypesUseCase,
    @inject("IUpdateDealTypeStatusUseCase")
    private _updateDealTypeStatusUseCase: IUpdateDealTypeStatusUseCase,
    @inject("IUpdateDealTypeUseCase")
    private _updateDealTypeUsecase: IUpdateDealTypeUseCase
  ) {}

  async getDealTypes(req: Request, res: Response): Promise<void> {
    const dealtypes = await this._getAllDealTypes.execute();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: DEAL_TYPE_SUCCESS.DEAL_TYPES_FETCHED,
      dealtypes,
    });
  }

  //admin

  async createDealType(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as {
        name: string;
        description?: string;
      };

      await this._createDealTypeUseCase.execute(name, description);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: DEAL_TYPE_SUCCESS.DEAL_TYPE_CREATED,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  async getAllPaginatedDealTypes(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const searchTermString = typeof search === "string" ? search : "";
      const { dealTypes, total, all } =
        await this._getAllPaginatedDealTypesUseCase.execute(
          pageNumber,
          pageSize,
          searchTermString
        );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: DEAL_TYPE_SUCCESS.DEAL_TYPES_FETCHED,
        dealTypes,
        totalPages: total,
        currentPage: pageNumber,
        totalDealTypes: all,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  async updateDealTypeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.params as { _id: string };

      await this._updateDealTypeStatusUseCase.execute(_id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: DEAL_TYPE_SUCCESS.DEAL_TYPE_UPDATED,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }

  async updateDealType(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.params as { _id: string };
      const { name, description } = req.body as {
        name: string;
        description: string;
      };

      await this._updateDealTypeUsecase.execute(_id, name, description);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: DEAL_TYPE_SUCCESS.DEAL_TYPE_UPDATED,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  }
}
