import { injectable } from "tsyringe";
import { IAdminEntity } from "../../../entities/models/admin_entity";
import { IAdminRepository } from "../../../entities/repositoryInterface/admin/admin_repository-interface";
import { AdminModel } from "../../../frameworks/database/models/admin_model";

@injectable()
export class AdminRepository implements IAdminRepository {
  async save(data: Partial<IAdminEntity>): Promise<IAdminEntity> {
    return await AdminModel.create(data);
  }

  async findByEmail(email: string): Promise<IAdminEntity | null> {
    return await AdminModel.findOne({ email });
  }
  
  async updateByEmail(
    email: string,
    updates: Partial<IAdminEntity>
  ): Promise<IAdminEntity | null> {
    const admin = await AdminModel.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    ).lean();
    if (!admin) return null;

    return {
      ...admin,
      id: admin._id.toString(),
    } as IAdminEntity;
  }
  
}
