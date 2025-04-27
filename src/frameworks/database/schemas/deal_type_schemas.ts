import { Schema } from "mongoose";
import { IDealTypeModel } from "../models/deal_type_model";


export const DealTypeSchema = new Schema<IDealTypeModel>(
  {
    name: {type:String,required:true},
    description:{type:String,required:true},
    isActive:{type:Boolean,default:true}
  },
  { timestamps: true }
);

DealTypeSchema.index({ isActive: 1 });