import { IPoint } from "./general-3d.model";

export interface IProjectile {
    model: THREE.Mesh;
    origin: IPoint;
    position: IPoint;
    destination: IPoint;
    lenght: number;
}