import { ILocationModel } from "./ILocation.model";

export interface IBasicBaazarModel {
  id: number;
  location: ILocationModel;
  name: string;
  image: string;
  averagePrice: number;
  evaluation: string;
}

export interface IBaazarModel extends IBasicBaazarModel {}
