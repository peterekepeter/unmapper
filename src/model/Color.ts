import { clamp } from "./ExtendedMath";

export class Color {

    red: number;
    green: number;
    blue: number;

    public static C_MIN = 0;
    public static C_MAX = 255;

    public static BLACK = new Color(0, 0, 0);
    public static WHITE = new Color(255, 255, 255);

    public constructor(red: number, green: number, blue: number) {
        this.red = this._clamp_component(red);
        this.green = this._clamp_component(green);
        this.blue = this._clamp_component(blue);
        Object.freeze(this);
    }

    public mix(color: Color, amount: number) {
        amount = clamp(0, amount, 1);
        const red = this.red + (color.red - this.red) * amount;
        const green = this.green + (color.green - this.green) * amount;
        const blue = this.blue + (color.blue - this.blue) * amount;
        return new Color(red, green, blue);
    }

    public toHex(): string {
        return '#' + (
            (this.red << 16) +
            (this.green << 8) + (this.blue)
        ).toString(16).padStart(6,'0');
    }

    public static fromHex(hex: string) {
        if (hex[0] == '#') {
            hex = hex.substr(1);
        }
        const int = Number.parseInt(hex, 16);
        switch (hex.length) {
            case 3: return new Color((int >> 8) * 17, ((int >> 4) & 15) * 17, (int & 15) * 17);
            case 6: return new Color(int >> 16, (int >> 8) & 255, int & 255);
            default: throw new Error('invalid format');
        }
    }

    private _clamp_component(value: number): number {
        return Math.round(clamp(Color.C_MIN, value, Color.C_MAX));
    }

}
