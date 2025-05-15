import { Request, Response } from "express";


export interface IDashboardController{
    fetchDashboardDetails(req:Request,res:Response):Promise<void>
}