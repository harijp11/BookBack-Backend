import { Schema } from "mongoose";
import { ICategoryModel } from "../models/category_model";

export const CategorySchema = new Schema<ICategoryModel>(
  {
    name: {type:String,required:true},
    description:{type:String,required:true},
    isActive:{type:Boolean,default:true}
  },
  { timestamps: true }
);

CategorySchema.index({ status: 1 });