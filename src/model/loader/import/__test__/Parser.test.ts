import { Parser } from '../Parser';
import { tokenize } from '../tokenizer';
import { makeParser } from '../parser-helper';

test("can create from tokens", () => {
    const tokens = tokenize("(Zone=ZoneInfo'MyLevel.ZoneInfo15',iLeaf=1316,ZoneNumber=1)");
    const parser = new Parser(tokens);
    expect(parser).not.toBeNull();
});

test("can get current token", () => {
    const parser = makeParser("Zone=ZoneInfo");
    expect(parser.getCurrentToken()).toBe("Zone");
});

test("can advance to next token", () => {
    const parser = makeParser("Zone=ZoneInfo");
    parser.moveToNext();
    expect(parser.getCurrentToken()).toBe("=");
});

test("can accept tokens", () => {
    const parser = makeParser("Zone=ZoneInfo");
    parser.moveToNext();
    parser.acceptAndMoveToNext("=");
    expect(parser.getCurrentToken()).toBe("ZoneInfo");
});

test("accept throws if wrong token tokens", () => {
    const parser = makeParser("Zone=ZoneInfo");
    parser.moveToNext();
    parser.acceptAndMoveToNext("=");
    expect(() => parser.acceptAndMoveToNext("(")).toThrow();
});