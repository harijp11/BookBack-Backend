// category_paginated.mapper.ts

import { IDealTypeEntity } from "../../../entities/models/deal_type_entity";

export const DealTypeMapper = (
  dealTypes: Pick<
    IDealTypeEntity,
    "_id" | "name" | "isActive" | "description" | "createdAt"
  >[]
): Pick<
  IDealTypeEntity,
  "_id" | "name" | "isActive" | "description" | "createdAt"
>[] => {
  return dealTypes.map((cat) => ({
    _id: cat._id,
    name: cat.name,
    description: cat.description,
    isActive: cat.isActive,
    createdAt: cat.createdAt,
  }));
};
