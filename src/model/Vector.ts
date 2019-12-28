
export class Vector
{
    public x: number;
    public y: number;
    public z: number;

    public static zero : Vector = new Vector(0,0,0);

    public static xUnit : Vector = new Vector(1,0,0);
    public static yUnit : Vector = new Vector(0,1,0);
    public static zUnit : Vector = new Vector(0,0,1);

    public constructor(x:number, y:number, z:number){
        this.x = x;
        this.y = y;
        this.z = z;
        Object.freeze(this);
    }

    public add(x:number, y:number, z:number) {
        return new Vector(this.x + x, this.y + y, this.z + z);
    }

    public subtract(x:number, y:number, z:number) {
        return new Vector(this.x - x, this.y - y, this.z - z);
    }

    public scale(s:number) {
        return new Vector(this.x * s, this.y * s, this.z * s);
    }

    public static fromArray(array: number[]): Vector {
        return new Vector(array[0], array[1], array[2]);
    }
    
};
