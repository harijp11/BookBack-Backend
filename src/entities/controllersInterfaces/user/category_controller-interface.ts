import { Request, Response } from "express";
import { ICategoryEntity } from "../../models/category_entity";

export interface ICategoryController {
    getCategories(req:Request,res:Response):Promise<void>;
}