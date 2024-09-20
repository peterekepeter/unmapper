import { deep_freeze } from "../../util/deep_freeze"
import { Actor } from "../Actor"


test('deep freezing actor disallows editing', () => {
    const a = new Actor()
    a.name = 'TestActor'
    
    deep_freeze(a)

    expect(() => a.name = 'EditedName').toThrow()
})

test('shallow copy creates and editable copy', () => {
    const a = new Actor()
    a.name = 'TestActor'
    deep_freeze(a)
    const b = a.shallow_copy()

    b.name = 'EditedActor'
    
    expect(b.name).toBe('EditedActor')
    expect(a.name).toBe('TestActor')
})
