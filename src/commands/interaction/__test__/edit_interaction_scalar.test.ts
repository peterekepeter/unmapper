import { create_initial_editor_state } from "../../../model/EditorState"
import { edit_interaction_scalar, edit_interaction_scalar_accepts_key } from "../edit_interaction_scalar"

test("no edit has null", () => 
    expect(scalar_from([])).toBe(null))

test("single digit number", () => 
    expect(scalar_from(['1'])).toBe(1))

test("multi digit number", () => 
    expect(scalar_from(['1', '3'])).toBe(13))

test("is strict about keys", () => 
    expect(() => scalar_from(['e'])).toThrow())

test("negative number", () => 
    expect(scalar_from(['-', '1', '3'])).toBe(-13))

test("double negation throws ", () => 
    expect(() => scalar_from(['-', '-', '3'])).toThrow())

test("can negate after number", () => 
    expect(scalar_from(['1', '3', '-'])).toBe(-13))

test("can undo negation with plus", () => 
    expect(scalar_from(['1', '3', '-', '+'])).toBe(13))

test("fractional", () => 
    expect(scalar_from(['3', '.', '1', '4'])).toBe(3.14))

test("backspace removes last digit", () => 
    expect(scalar_from(['3', '.', '1', '4', 'Backspace'])).toBe(3.1))

test("accepts number", () => 
    expect(accepts("14", "1")).toBe(true))

test("accepts backspace", () => 
    expect(accepts("14", "Backspace")).toBe(true))

test("positive does not accept plus", () => 
    expect(accepts("14", "+")).toBe(false))

test("negative does accept plus", () => 
    expect(accepts("-14", "+")).toBe(true))

test("positive does not accept backspace", () => 
    expect(accepts("", "Backspace")).toBe(false))

function scalar_from(list: string[]): number | null {
    let state = create_initial_editor_state()
    for (const item of list){
        state = edit_interaction_scalar(state, item)
    }
    return state.interaction_buffer.scalar?.value ?? null
}

function accepts(expression: string, next_key: string): boolean{
    let state = create_initial_editor_state()
    state = {
        ...state,
        interaction_buffer: {
            ...state.interaction_buffer,
            scalar: {
                expression,
                value: Number(expression),
            },
        },
    }
    return edit_interaction_scalar_accepts_key(state, next_key)
}
