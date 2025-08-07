import { inject, injectable } from "tsyringe";
import { IDashboardController } from "../../entities/controllersInterfaces/dashboard-controller-interface";
import { Request, Response } from "express";
import { handleErrorResponse } from "../../shared/utils/errorHandler";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { DashboardData, DashboardQuery, SalesData } from "../../entities/models/dashboard_entities";
import { IFetchDashboardDetailsUseCase } from "../../entities/useCaseInterfaces/admin/dashboard/fetch_dashboard_details_useacse-interface";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject('IFetchDashboardDetailsUseCase')
    private _fetchDashboardDetailsUseCase: IFetchDashboardDetailsUseCase
  ) {}

  async fetchDashboardDetails(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, view, topLimit } = req.query as DashboardQuery;
      const data: DashboardData = await this._fetchDashboardDetailsUseCase.execute(
        startDate,
        endDate,
        view,
        topLimit
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DASHBOARD_DETAILS_FETCHED,
        ...data,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}

