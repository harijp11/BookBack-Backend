import { ObjectId } from "mongoose";

export interface IDealTypeEntity{
    _id?:ObjectId,
    name:string,
    description:string,
    isActive:boolean,
    createdAt: Date;
    updatedAt: Date;
}