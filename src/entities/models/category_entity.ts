import { ObjectId } from "mongoose";

export interface ICategoryEntity{
    _id?:ObjectId,
    name:string,
    description:string,
    isActive:boolean,
    createdAt: Date;
    updatedAt: Date;
}