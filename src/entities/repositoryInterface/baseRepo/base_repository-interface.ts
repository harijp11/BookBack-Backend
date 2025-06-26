import { Document } from "mongoose"

export interface IBaseRepository<T ,CreateDTO = unknown>{
     create(data:CreateDTO):Promise<T | null>
     save<T extends Document>(data:T):Promise<T | void>
     findById(id:string):Promise<T | undefined | null>
     updateStatus(_id: string, status: boolean | string): Promise<T | null>
}