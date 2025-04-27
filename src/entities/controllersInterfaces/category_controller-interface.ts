import { Request, Response } from "express";
import { ICategoryEntity } from "../models/category_entity";

export interface ICategoryController {
    //admin
    createNewCategory(req:Request,res:Response):Promise<void>;
    getAllPaginatedCategories(req:Request,res:Response):Promise<void>;
    updateCategoryStatus(req:Request,res:Response):Promise<void>;
    updateCategory(req:Request,res:Response):Promise<void>;
    
    //user
    getAllCategories(req:Request,res:Response):Promise<void>;
}