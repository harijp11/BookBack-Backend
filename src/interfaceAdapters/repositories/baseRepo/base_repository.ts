import { injectable } from "tsyringe";
import { IBaseRepository } from "../../../entities/repositoryInterface/baseRepo/base_repository-interface";
import { Model } from "mongoose";

@injectable()
   export class BaseRepository<T, CreateDTO = unknown> implements IBaseRepository<T, CreateDTO> {
  constructor(protected model:Model<T>) {}
    async create(data: CreateDTO): Promise<null | T> {
       return await this.model.create(data);
    }
}