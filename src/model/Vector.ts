
export class Vector {
    public x: number;
    public y: number;
    public z: number;

    public static ZERO: Vector = new Vector(0, 0, 0);
    public static ONES: Vector = new Vector(1, 1, 1);

    public static FORWARD: Vector = new Vector(1, 0, 0);
    public static RIGHT: Vector = new Vector(0, 1, 0);
    public static UP: Vector = new Vector(0, 0, 1);

    public static UNIT_X: Vector = new Vector(1, 0, 0);
    public static UNIT_Y: Vector = new Vector(0, 1, 0);
    public static UNIT_Z: Vector = new Vector(0, 0, 1);

    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        Object.freeze(this);
    }

    public addVector(v: Vector) {
        return this.add(v.x, v.y, v.z);
    }

    public add(x: number, y: number, z: number) {
        return new Vector(this.x + x, this.y + y, this.z + z);
    }

    public subtract(x: number, y: number, z: number) {
        return new Vector(this.x - x, this.y - y, this.z - z);
    }

    public scale(s: number) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    public static fromArray(array: number[], index = 0): Vector {
        return new Vector(array[index + 0], array[index + 1], array[index + 2]);
    }

    public equals(vector: Vector): boolean {
        return this.x === vector.x
            && this.y === vector.y
            && this.z === vector.z;
    }

};
