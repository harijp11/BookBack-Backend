
import { IAdminEntity } from "../../models/admin_entity";

export interface IAdminRepository {
  save(data: Partial<IAdminEntity>): Promise<IAdminEntity>;
  findByEmail(email: string): Promise<IAdminEntity | null>;
  updateByEmail(
		email: string,
		updates: Partial<IAdminEntity>
	): Promise<IAdminEntity | null>;
}