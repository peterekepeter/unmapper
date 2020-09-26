import { Polygon } from "../../Polygon";
import { Vector } from "../../Vector";
import { triangulate } from "../triangluate";


test('empty returns empty', () => expect(triangulate([])).toEqual([]));

describe('triangulate a single triangle', () => {
    let initial : Polygon[] = [];
    const poly = new Polygon();
    poly.vertexes.push(new Vector(-1, -1, 0));
    poly.vertexes.push(new Vector(+1, -1, 0));
    poly.vertexes.push(new Vector(+1, +1, 0));
    initial.push(poly);
    const triangulated = triangulate(initial);

    test('returns the same triangle', () => expect(triangulated[0]).toEqual(initial[0]));
})

describe('triangulate a single quad', () =>{
    let initial : Polygon[] = [];
    let triangulated : Polygon[] = null;

    beforeAll(() => {
        const poly = new Polygon();
        poly.vertexes.push(new Vector( 0,  0, 0));
        poly.vertexes.push(new Vector(+1,  0, 0));
        poly.vertexes.push(new Vector(+1, +1, 0));
        poly.vertexes.push(new Vector( 0, +1, 0));
        initial.push(poly);
        triangulated = triangulate(initial);
    })

    test('does not return null', () => expect(triangulated).not.toBeNull());

    test('result has 2 polygons', () => expect(triangulated.length).toEqual(2));

    test('first polygon shares exactly 2 vertexes with the second one', 
        () => expect(triangulated[0].vertexes.filter(v => triangulated[1].vertexes.indexOf(v) !== -1)).toHaveLength(2));

    test('result only contains triangles', () => expect(triangulated.map(p => p.vertexes.length)).toEqual([3, 3]))

    test('reuses same vertexes', () => triangulated.forEach(p => p.vertexes.forEach(
            v => expect(initial[0].vertexes).toContain(v))));

    test('each vertex in resulting polygon is unique', () => triangulated.forEach(
        p => p.vertexes.forEach(
            (v,i) => expect(p.vertexes.indexOf(v) === i))))

})