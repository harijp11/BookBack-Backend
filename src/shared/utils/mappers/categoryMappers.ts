// category_paginated.mapper.ts

import { ICategoryEntity } from "../../../entities/models/category_entity";

export const CategoryMapper = (
  categories: Pick<
    ICategoryEntity,
    "_id" | "name" | "isActive" | "description" | "createdAt"
  >[]
): Pick<
  ICategoryEntity,
  "_id" | "name" | "isActive" | "description" | "createdAt"
>[] => {
  return categories.map((cat) => ({
    _id: cat._id,
    name: cat.name,
    description: cat.description,
    isActive: cat.isActive,
    createdAt: cat.createdAt,
  }));
};
