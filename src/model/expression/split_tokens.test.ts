import { split_tokens } from "./split_tokens"

test('split with discard', ()=> {
    expect(split_tokens(['abc def    efg'], /\s+/, { discard: true }))
        .toEqual(['abc','def', 'efg'])
})

test('split global without discard', ()=> {
    expect(split_tokens(['3123xyz3123aa'], /\d+/g))
        .toEqual(['3123','xyz','3123','aa'])
})

test('split non-global without discard', ()=> {
    expect(split_tokens(['3123xyz3123aa'], /\d+/))
        .toEqual(['3123','xyz3123aa'])
})

test('token split piping', () =>{
    const step = split_tokens([' 3x 4y 5z '], /\s+/g, { discard: true });
    const final = split_tokens(step, /\d+/g);
    expect(final).toEqual(['3','x','4','y','5','z']);
})