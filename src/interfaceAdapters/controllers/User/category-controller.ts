import { inject, injectable } from "tsyringe";
import { ICategoryController } from "../../../entities/controllersInterfaces/user/category_controller-interface";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants";
import { IGetAllCategoriesUseCase } from "../../../entities/useCaseInterfaces/user/category/get_all_categories_usecase-interface";

@injectable()
export class CategoryController implements ICategoryController{

    constructor(
        @inject("IGetAllCategoriesUseCase")
        private _getAllCategories:IGetAllCategoriesUseCase
    ){}
     async  getCategories(req: Request, res: Response): Promise<void> {
        const categories = await this._getAllCategories.execute()
         res.status(HTTP_STATUS.OK).json({
            success:true,
            message:"categoires fetched successfully",
            categories
         });
        }

          
    }

