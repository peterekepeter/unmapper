import { deep_freeze } from "./deep_freeze"


test('cannot change object property', () => 
    expect(() => deep_freeze({ x: 4 }).x = 16).toThrow())

test('cannot add new property', () => 
    expect(() => deep_freeze({} as {x?:number}).x = 16).toThrow())
    
test('cannot push new element into list', () => 
    expect(() => deep_freeze([4]).push(16)).toThrow())

test('does not change the object', () => {
    const obj = {x:3, y:4}
    const clone = {...obj}
    expect(deep_freeze(obj)).toEqual(clone)
})

test('cannot change element in list', () =>
    expect(() => deep_freeze([4,8])[0] = 16).toThrow())

test('cannot edit subobject property', () => 
    expect(() => deep_freeze({x:4, child: { x:3 }}).child.x = 4).toThrow())


test('cannot push to member list', () => 
    expect(() => deep_freeze({x:4, children: []}).children.push(13)).toThrow())


