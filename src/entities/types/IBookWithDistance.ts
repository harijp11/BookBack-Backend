import { IMapBookEntity } from "./IBookMapEnitity";

export interface IBookWithDistance extends IMapBookEntity {
  distance: number;
}