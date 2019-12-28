import { tokenize } from "../tokenizer";

test("splits by space", () => {
    expect(tokenize("Begin Map")).toEqual(['Begin', 'Map']);
})

test("splits by equals operator", () => {
    expect(tokenize("CsgOper=CSG_Add"))
        .toEqual(['CsgOper', '=', 'CSG_Add']);
})

test("splits ojects paranthesis", () => {
    expect(tokenize("MainScale=(SheerAxis=SHEER_ZX)"))
        .toEqual(['MainScale', '=', '(', 'SheerAxis', '=', 'SHEER_ZX', ')']);
})

test("splits ojects properties", () => {
    expect(tokenize("Region=(Zone=ZoneInfo'MyLevel.ZoneInfo15',iLeaf=1316,ZoneNumber=1)"))
        .toEqual([
            'Region', '=', '(', 
            'Zone', '=', 'ZoneInfo\'MyLevel.ZoneInfo15\'', ',',
            'iLeaf', '=', '1316', ',',
            'ZoneNumber', '=', '1',
            ')']);
})

test("splits vector components", () => {
    expect(tokenize("Location=(X=1232.000000,Y=-1456.000000,Z=-176.000000)"))
        .toEqual([
            'Location', '=', '(', 
            'X', '=', '1232.000000', ',',
            'Y', '=', '-1456.000000', ',',
            'Z', '=', '-176.000000', 
            ')']);
})