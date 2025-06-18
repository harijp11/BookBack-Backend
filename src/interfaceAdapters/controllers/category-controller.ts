import { inject, injectable } from "tsyringe";
import { ICategoryController } from "../../entities/controllersInterfaces/category_controller-interface";
import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IGetAllCategoriesUseCase } from "../../entities/useCaseInterfaces/user/category/get_all_categories_usecase-interface";
import { IcreateNewCategoryUseCase } from "../../entities/useCaseInterfaces/admin/category/create_category_usecase-interface";
import { IGetAllPaginatedCategoryUseCase } from "../../entities/useCaseInterfaces/admin/category/get_all_paginated_categories_usecase-interface";
import { IUpdateCategoryStatus } from "../../entities/useCaseInterfaces/admin/category/update_category_status_usecase-interface";
import { IUpdateCategoryUseCase } from "../../entities/useCaseInterfaces/admin/category/update_category_usecase-interface";
import { handleErrorResponse } from "../../shared/utils/errorHandler";

@injectable()
export class CategoryController implements ICategoryController {
  constructor(
    @inject("IGetAllCategoriesUseCase")
    private _getAllCategories: IGetAllCategoriesUseCase,

    
    @inject("ICreateCategoryUseCase")
    private _createNewCategoryUseCase: IcreateNewCategoryUseCase,
    @inject("IGetAllPaginatedCategoryUseCase")
    private _getAllPaginatedCategoryUseCase: IGetAllPaginatedCategoryUseCase,
    @inject("IUpdateCategoryStatus")
    private _updateCategoryStatusUseCase: IUpdateCategoryStatus,
    @inject("IUpdateCategoryUseCase")
    private _updateCategoryUseCase: IUpdateCategoryUseCase
  ) {}
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this._getAllCategories.execute();
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "categoires fetched successfully",
        categories,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  //admin

  async createNewCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as {
        name: string;
        description: string;
      };
      await this._createNewCategoryUseCase.execute(name, description);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Category already exists")
      ) {
        res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: "A category with this name already exists",
          error: "DUPLICATE_CATEGORY",
        });
        return;
      }
      handleErrorResponse(res, error);
    }
  }

  async getAllPaginatedCategories(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const searchTermString = typeof search === "string" ? search : "";

      const { categories, total, all } =
        await this._getAllPaginatedCategoryUseCase.execute(
          pageNumber,
          pageSize,
          searchTermString
        );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        categories,
        totalPages: total,
        currentPage: pageNumber,
        totalCategory: all,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateCategoryStatus(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params as { categoryId: string };
      await this._updateCategoryStatusUseCase.execute(categoryId);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params as { categoryId: string };
      const { name, description } = req.body as {
        name: string;
        description: string;
      };

      await this._updateCategoryUseCase.execute(categoryId, name, description);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(res, error);
    }
  }
}
