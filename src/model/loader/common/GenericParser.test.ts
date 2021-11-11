import { makeParser } from '../import/parser-helper'
import { tokenize } from '../import/tokenizer'
import { GenericParser } from './GenericParser'

test("can create from tokens", () => {
    const tokens = tokenize("(Zone=ZoneInfo'MyLevel.ZoneInfo15',iLeaf=1316,ZoneNumber=1)")
    const parser = new GenericParser(tokens)
    expect(parser).not.toBeNull()
})

test("can get current token", () => {
    const parser = makeParser("Zone=ZoneInfo")
    expect(parser.get_current_token()).toBe("Zone")
})

test("can advance to next token", () => {
    const parser = makeParser("Zone=ZoneInfo")
    parser.move_to_next()
    expect(parser.get_current_token()).toBe("=")
})

test("can accept tokens", () => {
    const parser = makeParser("Zone=ZoneInfo")
    parser.move_to_next()
    parser.accept_and_move_to_next("=")
    expect(parser.get_current_token()).toBe("ZoneInfo")
})

test("accept throws if wrong token tokens", () => {
    const parser = makeParser("Zone=ZoneInfo")
    parser.move_to_next()
    parser.accept_and_move_to_next("=")
    expect(() => parser.accept_and_move_to_next("(")).toThrow()
})
