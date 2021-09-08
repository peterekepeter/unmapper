import { BrushModel } from "../../BrushModel"
import { BrushModelBuilder } from "../../BrushModelBuilder"
import { BrushPolygon } from "../../BrushPolygon"
import { BrushVertex } from "../../BrushVertex"
import { __extract_edges, createBrushPolygon } from "../createBrushPolygon"

describe("create on grid", () => {
    
    /* test data topology
    
    0 --- 1 --- 2 
    |  A  |  B  |
    3 --- 4 --- 5
    |  C  |  ?  :
    6 --- 7 ... 8

    */

    const POLY_A = new BrushPolygon(); POLY_A.vertexes.push(0, 1, 4, 3)
    const POLY_B = new BrushPolygon(); POLY_B.vertexes.push(4, 1, 2, 5)
    const POLY_C = new BrushPolygon(); POLY_C.vertexes.push(3, 4, 7, 6)

    const POLYS = [POLY_A, POLY_B, POLY_C]

    describe("extract edges", () => {

        test('__extract_edges basic test', () => 
            expect(__extract_edges(POLYS, [0, 1])).toEqual([[0, 1]]))
        
        test('__extract_edges for new poly', () => 
            expect(__extract_edges(POLYS, [4, 5, 7, 8])).toEqual([[5, 4], [4, 7]]))
        
        test('__extract_edges returns a result for each poly', () => 
            expect(__extract_edges(POLYS, [1, 4])).toEqual([[1, 4], [4, 1]]))

    })

    const VERTEXES = BrushVertex.from_array_to_list([0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 1, 1, 0, 2, 1, 0, 0, 2, 0, 1, 2, 0, 2, 2, 0])

    const BRUSH = new BrushModel()

    BRUSH.vertexes = VERTEXES
    BRUSH.polygons = POLYS
    BRUSH.rebuild_all_poly_edges()

    describe("create_brush_polygon", () => {

        test(`selection 4, 5, 8, 7 creates correct polygon`, () => check(4, 5, 8, 7))
        test(`selection 4, 7, 5, 8 creates correct polygon`, () => check(4, 7, 5, 8))
        test(`selection 5, 7, 8, 4 creates correct polygon`, () => check(5, 7, 8, 4))

        function check(...selection: number[]){
        
            const result = createBrushPolygon(BRUSH, selection)
            const result_poly = result.polygons.find(p => p.vertexes.indexOf(8) !== -1)
            expect(result_poly).toBeTruthy()
            const edges_string = __extract_edges([result_poly], selection).map(edge => `${edge[0]}->${edge[1]}`)
            expect(edges_string).toContain("4->5")
            expect(edges_string).toContain("5->8")
            expect(edges_string).toContain("8->7")
            expect(edges_string).toContain("7->4")
        }
    })

})

describe("bridge gap", () => {

    /* test data topology, bottom is a bit skewed
    
        0 --- 1  
        |  A  | 
        2 --- 3 
         :  C  : 
          4 --- 5
          |  B  | 
          6 --- 7 

    */

    let brush : BrushModel

    beforeEach(() => {

        const builder = new BrushModelBuilder()
    
        builder.add_vertex_coords(0, 0, 0) // 0
        builder.add_vertex_coords(1, 0, 0) // 1
        builder.add_vertex_coords(0, 1, 0) // 2
        builder.add_vertex_coords(1, 1, 0) // 3
        
        builder.add_vertex_coords(1, 2, 0) // 4 
        builder.add_vertex_coords(2, 2, 0) // 5
        builder.add_vertex_coords(1, 3, 0) // 6
        builder.add_vertex_coords(2, 3, 0) // 7

        builder.add_polygon(0, 1, 3, 2)
        builder.add_polygon(4, 5, 7, 6)

        brush = builder.build()
    })

    test("create from 2,3,5,4", () => check(2, 3, 5, 4))

    test("create from 2,3,4,5", () => check(2, 3, 4, 5))
    
    test("create from 5,4,3,2", () => check(5, 4, 3, 2))

    test("create from 5,4,3,2", () => check(5, 4, 2, 3))

    function check(...vertex_list: number[]){
        const result = createBrushPolygon(brush, vertex_list)
        const result_poly = result.polygons.find(p => p.vertexes.indexOf(3) !== -1
            && p.vertexes.indexOf(4) !== -1)
        expect(result_poly).toBeTruthy()
        const edges_string = __extract_edges([result_poly], vertex_list).map(edge => `${edge[0]}->${edge[1]}`)
        expect(edges_string).toContain("2->3")
        expect(edges_string).toContain("3->5")
        expect(edges_string).toContain("5->4")
        expect(edges_string).toContain("4->2")
    }
    
})

