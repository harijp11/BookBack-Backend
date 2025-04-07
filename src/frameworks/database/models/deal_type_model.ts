import { ObjectId,Document,model } from "mongoose";

import { IDealTypeEntity } from "../../../entities/models/deal_type_entity";
import { DealTypeSchema } from "../schemas/deal_type_schemas";

export interface IDealTypeModel extends Omit<IDealTypeEntity,"_id">,Document{
    _id: ObjectId
}

export const  DealTypeModel = model<IDealTypeModel>("DealType",DealTypeSchema)