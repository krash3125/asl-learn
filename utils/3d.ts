interface V3D {
    x: number;
    y: number;
    z: number;
}

export function distanceVector( v1:V3D, v2:V3D )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}
