import { Actor } from "../../Actor";
import { BoundingBox } from "../../BoundingBox";
import { BrushModel } from "../../BrushModel";
import { BrushVertex } from "../../BrushVertex";
import { Vector } from "../../Vector";
import { GeometryCache } from "../GeometryCache";


test('returns correct bounding box', () => {
    const cache = new GeometryCache()
    cache.actors = [make_actor({ location: new Vector(10, 0, 0) })]
    expect(cache.get_bounding_box(0)).toEqual(new BoundingBox({
        min_x: 9, max_x: 11, min_y: -1, max_y: +1, min_z: 0, max_z: 0
    }))
})

test('returns correct transformed vertexes', () => {
    const cache = new GeometryCache()
    cache.actors = [make_actor({ location: new Vector(10, 0, 0) })]
    expect(cache.get_world_transformed_vertexes(0)).toEqual(BrushVertex.fromArrayToList([
        +9, -1, 0, +11, -1, 0, +11, +1, 0, +9, +1, 0
    ]).map(v => v.position))
})

describe('cache invalidation', () => {

    test('returns correct bounding box after actor change', () => {
        const cache = new GeometryCache()
        cache.actors = [make_actor({ location: new Vector(10, 0, 0) })]
        cache.actors = [make_actor({ location: new Vector(-10, 0, 0) })]
        expect(cache.get_bounding_box(0)).toEqual(new BoundingBox({
            min_x: -11, max_x: -9, min_y: -1, max_y: +1, min_z: 0, max_z: 0
        }))
    })
    
    test('returns correct transformed vertexes after actor change', () => {
        const cache = new GeometryCache()
        cache.actors = [make_actor({ location: new Vector(10, 0, 0) })]
        cache.actors = [make_actor({ location: new Vector(-10, 0, 0) })]
        expect(cache.get_world_transformed_vertexes(0)).toEqual(BrushVertex.fromArrayToList([
            -11, -1, 0, -9, -1, 0, -9, +1, 0, -11, +1, 0
        ]).map(v => v.position))
    })
    
})

function make_actor(options?: { location?: Vector }): Actor {
    const actor = new Actor()
    actor.brushModel = new BrushModel()
    actor.brushModel.vertexes = BrushVertex.fromArrayToList([-1, -1, 0, +1, -1, 0, +1, +1, 0, -1, +1, 0])
    actor.location = options?.location ?? Vector.ZERO
    return actor
}