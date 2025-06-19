
import { IAdminModel } from "../../../frameworks/database/models/admin_model";
import { IAdminEntity } from "../../models/admin_entity";
import { IBaseRepository } from "../baseRepo/base_repository-interface";

export interface IAdminRepository extends IBaseRepository<IAdminModel> {
 
  findByEmail(email: string): Promise<IAdminEntity | null>;
  updateByEmail(
		email: string,
		updates: Partial<IAdminEntity>
	): Promise<IAdminEntity | null>;
}