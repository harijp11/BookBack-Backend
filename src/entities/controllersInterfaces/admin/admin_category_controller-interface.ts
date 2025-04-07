import { Request,Response } from "express";

export  interface IAdminCategoryController {
      createNewCategory(req:Request,res:Response):Promise<void>;
      getAllPaginatedCategories(req:Request,res:Response):Promise<void>;
      updateCategoryStatus(req:Request,res:Response):Promise<void>;
      updateCategory(req:Request,res:Response):Promise<void>;
}