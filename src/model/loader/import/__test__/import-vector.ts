import { vectorFromString, importVector } from "../vector-importer"
import { Vector } from "../../../Vector";

test("can parse vector format", () => parseAndCheck(
    "+00128.000000,+00128.000000,+00000.000000", 
    new Vector(128,128,0)
));

test("correctly parses negative numbers", () => parseAndCheck(
    "-00128.000000,+00128.000000,-00001.000000", 
    new Vector(-128,128,-1)
));

test("correctly parses fractional part", () => parseAndCheck(
    "+00000.125000,+00000.500000,+00000.000000", 
    new Vector(0.125,0.5,0)
));

test("can parse object format", () => parseAndCheck(
    "(X=1488.000000,Y=-1376.000000,Z=-176.000000)", 
    new Vector(1488,-1376,-176)
));

test("backfills missing value with default", () => parseAndCheck(
    "(Y=-1376.000000)", 
    new Vector(42,-1376,42),
    42
));

test("can parse object format when wrapped in paranthesis", () => parseAndCheck(
    "(X=1488.000000,Y=-1376.000000,Z=-176.000000)", 
    new Vector(1488,-1376,-176)
));

function parseAndCheck(s:string, v:Vector, defaultValue : number = 0){
    expect(importVector(s, defaultValue)).toEqual(v);
}