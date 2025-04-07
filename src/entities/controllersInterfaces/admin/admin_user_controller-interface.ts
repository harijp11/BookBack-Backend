import { Request, Response } from "express";

export interface IAdminUserController {
	getAllUsers(req: Request, res: Response): Promise<void>;
	updateUserStatus(req: Request, res: Response): Promise<void>;
	// updateUserProfile(req: Request, res: Response): Promise<void>;
	// changePassword(req: Request, res: Response): Promise<void>;
	// getAllCategories(req: Request, res: Response): Promise<void>;
}
