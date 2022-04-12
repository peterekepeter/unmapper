import { 
    clearStyleClasses as clear,
    getRegisteredClassCount as getCount, 
    registerStyleClass as register, 
    renderStyleClassesCss as render,
} from "./registerStyleClass"

test('successfully register basic style class', () => {
    const result = register('my-class', () => ({}))
    expect(result).toBe('my-class')
})

test('registering same class multiple times yields different names', () => {
    const result1 = register('wrapper', () => ({}))
    const result2 = register('wrapper', () => ({}))
    const result3 = register('wrapper', () => ({}))
    expect(result1).toBe('wrapper')
    expect(result2).toBe('wrapper-1')
    expect(result3).toBe('wrapper-2')
})

test('can get class count', () => {
    register('btn', () => ({}))
    expect(getCount()).toBe(1)
    register('btn', () => ({}))
    expect(getCount()).toBe(2)
})

test('render css class with color', () => {
    register('btn', () => ({ color: 'red' }))
    expect(render()).toBe('.btn{color:red}')
})

test('render css class with background', () => {
    register('btn', () => ({ background: 'red' }))
    expect(render()).toBe('.btn{background:red}')
})

test('render css with 2 properties', () => {
    register('btn', () => ({ color: 'red', background: '#000' }))
    expect(render()).toBe('.btn{background:#000;color:red}')
})

test('render css with 2 classes', () => {
    register('c-red', () => ({ color: '#f00' }))
    register('c-green', () => ({ color: '#0f0' }))
    expect(render()).toBe('.c-red{color:#f00}\n.c-green{color:#0f0}')
})

test('empty classes are skipped during render', () => {
    register('btn', () => ({}))
    register('btn', () => ({ color: '#0f0' }))
    expect(render()).toBe('.btn-1{color:#0f0}')
})

test('class hover rule', () => {
    register('btn', () => ({ hover: { color: '#f00' } }))
    expect(render()).toBe('.btn:hover{color:#f00}')
})

beforeEach(clear)
