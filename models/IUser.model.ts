import { baazarItemType } from "../enums/baazarItemType";
import { ILocationModel } from "./ILocation.model";

export interface IBasicBaazarModel {
  id: number;
  location: ILocationModel;
  name: string;
  logoImage: string;
  images: string[];
  itemsType: baazarItemType[];
  averagePrice: number;
  evaluation: number;
  openingHours: string[];
}

export interface IBaazarModel extends IBasicBaazarModel {}
