import { injectable } from "tsyringe";
import { IAdminEntity } from "../../../entities/models/admin_entity";
import { IAdminRepository } from "../../../entities/repositoryInterface/admin/admin_repository-interface";
import { AdminModel, IAdminModel } from "../../../frameworks/database/models/admin_model";
import { BaseRepository } from "../baseRepo/base_repository";

@injectable()
export class AdminRepository extends BaseRepository<IAdminModel> implements IAdminRepository {
  constructor(){
    super(AdminModel);
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
