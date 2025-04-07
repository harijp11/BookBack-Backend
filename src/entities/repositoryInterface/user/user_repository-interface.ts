import { IUserEntity } from "../../models/user_entity";

export interface IUserRepository {
  save(data: Partial<IUserEntity>): Promise<IUserEntity>;
  findByEmail(email: string): Promise<IUserEntity | null>;
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user:IUserEntity[] | []; total: number }>;
  findById(id: any): Promise<IUserEntity | null>;
  updateByEmail(
    email: string,
    updates: Partial<IUserEntity>
  ): Promise<IUserEntity | null>;
  findByIdAndUpdate(
    id: any,
    updateData: Partial<IUserEntity>
  ): Promise<IUserEntity | null>;
}