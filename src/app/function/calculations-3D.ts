import { IPoint } from "../interface/general-3d.model";

export function distanceVector( p1: IPoint, p2: IPoint )
{
    const a = p2.x - p1.x;
    const b = p2.y - p1.y;
    const c = p2.z - p1.z;

    return Math.hypot(a,b,c);
}