import { IPoint } from "./general-3d.model";

export interface IShip {
    model: THREE.Group;
    velocity: IPoint;
}