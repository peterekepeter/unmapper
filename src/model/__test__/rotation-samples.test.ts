import { Vector } from "../Vector";
import { unrealAngleToDegrees } from "../loader/converter/convert-angles";
import { Rotation } from "../Rotation";

/** 
 * Test data collected from editor by applying transformation from UED,
 * rotated vectors were corrected, aim to produce correct results.
 */
const rotationSamples : { 
    name: string,
    before : Vector, 
    after : Vector, 
    pitch: number, 
    roll: number, 
    yaw:number 
}[] = [
    {
        name: '90 deg pitch',
        before: new Vector( +256.00, +64.00, -128.00 ),
        after:  new Vector( +128.00, +64.00, +256.00 ),
        pitch: 16384, roll: 0, yaw: 0,
    },
    {
        name: '90 deg roll',
        before: new Vector( +256.00, +64.00, -128.00 ),
        after:  new Vector( +256.00,-128.00, -64.00 ),
        pitch: 0, roll: 16384, yaw: 0,
    },
    {
        name: '90 deg yaw',
        before: new Vector( +256.00,+64.00,-128.00 ),
        after:  new Vector( -64.00,+256.00,-128.00 ),
        pitch: 0, roll: 0, yaw: 16384,
    },
    {
        name: '90 deg roll + 90 deg yaw',
        before: new Vector( -272.0,-128.0, -64.0 ),
        after: new Vector(   +64.0,-272.0,+128.0 ),
        pitch: 0, roll: 16384, yaw: 81920,
    },
    {
        name: '90 deg roll + 180 deg yaw',
        before: new Vector( +0.0,-128.0,  +0.0 ),
        after:  new Vector( +0.0,  +0.0,+128.0 ),
        pitch: 0, roll: 16384, yaw: 32768,
    },
    {
        name: '90 deg roll + 90 deg yaw',
        before: new Vector( +256.0,+64.0,-128.0 ),
        after:  new Vector( +128.0,+256.0,-64.0 ),
        pitch: 0, roll: 16384, yaw: 16384,
    },
    {
        name: '90 deg pitch + 90 deg roll',
        before: new Vector( +256.00, +64.00,-128.00 ),
        after:  new Vector(  +64.00,-128.00,+256.00 ),
        pitch: 16384, roll: 16384, yaw: 0,
    },
    {
        name: '90 deg pitch + 90 deg yaw',
        before: new Vector( +256.00, +64.00,-128.00 ),
        after:  new Vector(  -64.00,+128.00,+256.00 ),
        pitch: 16384, roll: 0, yaw: 16384,
    },
    {
        name: '90 deg pitch + 90 deg roll + 90 deg yaw',
        before: new Vector( +256.00, +64.00, -128.00 ),
        after:  new Vector( +128.00, +64.00, +256.00 ),
        pitch: 16384, roll: 16384, yaw: 16384,
    }
]

rotationSamples.forEach((sample, index) => 
    test(`rotation sample#${index}: ${sample.name}`, () => {
        const r = new Rotation(
            unrealAngleToDegrees(sample.pitch), 
            unrealAngleToDegrees(sample.yaw), 
            unrealAngleToDegrees(sample.roll)
        );
        expect(r.apply(sample.before)).toEqual(sample.after);
    })
);