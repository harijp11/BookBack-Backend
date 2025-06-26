import { injectable } from "tsyringe";
import { IBaseRepository } from "../../../entities/repositoryInterface/baseRepo/base_repository-interface";
import { Document, Model } from "mongoose";

@injectable()
export class BaseRepository<T, CreateDTO = unknown>
  implements IBaseRepository<T, CreateDTO>
{
  constructor(protected model: Model<T>) {}
  async create(data: CreateDTO): Promise<null | T> {
    return await this.model.create(data);
  }


  async save<T extends Document>(data: T): Promise<T | void> {
    await data.save();
  }


  async findById(_id: string): Promise<T | undefined | null> {
    const Item = await this.model.findById(_id);
    return Item;
  }

  
  async updateStatus(_id: string, status: boolean | string): Promise<T | null> {
    const Item = await this.model.findByIdAndUpdate(
       _id,
      { $set: { status } },
      { new: true } 
    );
    return Item;
  }


}
