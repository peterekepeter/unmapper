import { Vector } from "../Vector";
import { split_tokens } from "./split_tokens";


export function expression_from_vector(vector: Vector): string {
    const result = [];
    if (vector.x !== 0) {
        result.push(vector.x, 'x');
    }
    if (vector.y !== 0) {
        if (result.length > 0) { result.push(' ') }
        result.push(vector.y, 'y');
    }
    if (vector.z !== 0) {
        if (result.length > 0) { result.push(' ') }
        result.push(vector.z, 'z');
    }
    return result.join('');
}

export function vector_from_expression(original: string): Vector {
    const whitespace_rule = /\s+/g;
    const number_rule = /[+-]?\d+\.?\d*/g;
    const no_whitespace = split_tokens([original], whitespace_rule, { discard: true });
    const tokens = split_tokens(no_whitespace, number_rule);

    let number = false;
    let number_value = 0;
    let x_value = 0;
    let y_value = 0;
    let z_value = 0;
    for (const token of tokens) {
        if (number) {
            switch (token) {
                case 'x': x_value += number_value; break;
                case 'y': y_value += number_value; break;
                case 'z': z_value += number_value; break;
                default: throw new Error(
                    `invalid expression, expected xyz, found ${token} instead`
                )
            }
            number = false;
            number_value = 0;
        } else {
            if (!token.match(number_rule)) {
                throw new Error(
                    `invalid expression, expected number, found ${token} instead`
                )
            }
            number = true;
            number_value = Number(token);
        }
    }
    return new Vector(x_value, y_value, z_value);
}


export function tweak_expression_value(expression: string, tweak_at: number, tweak_delta: number): string {
    let position = 0;
    let tweaked = false;
    const result = [];
    for (const term of split_tokens([expression], /\s*[.0-9xyz+-]+\s*/g))
    {
        if (!tweaked && tweak_at >= position && tweak_at < position + term.length){
            // match!
            for (const token of split_tokens([term], /[+-]?\d+\.?\d*/g)){
                const parsed = Number(token)
                if (!tweaked && !isNaN(parsed)){
                    result.push(parsed + tweak_delta)
                    tweaked = true;
                } else {
                    result.push(token)
                }
            }
        } else {
            result.push(term);
        }
        position += term.length;
    }

    return result.join('');
}