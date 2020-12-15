import { BrushModel } from "../../BrushModel";
import { BrushPolygon } from "../../BrushPolygon";
import { BrushVertex } from "../../BrushVertex";
import { createBrushPolygon, __extract_edges } from "../createBrushPolygon";


/* test data topology
 
  0 --- 1 --- 2 
  |  A  |  B  |
  3 --- 4 --- 5
  |  C  |  ?  :
  6 --- 7 ... 8

*/

const POLY_A = new BrushPolygon(); POLY_A.vertexes.push(0,1,4,3);
const POLY_B = new BrushPolygon(); POLY_B.vertexes.push(4,1,2,5);
const POLY_C = new BrushPolygon(); POLY_C.vertexes.push(3,4,7,6);

const POLYS = [POLY_A, POLY_B, POLY_C];

describe("extract edges", () => {

  test('__extract_edges basic test', () => 
      expect(__extract_edges(POLYS, [0,1])).toEqual([[0,1]]));
  
  test('__extract_edges for new poly', () => 
      expect(__extract_edges(POLYS, [4,5,7,8])).toEqual([[5,4], [4,7]]));
  
  test('__extract_edges returns a result for each poly', () => 
      expect(__extract_edges(POLYS, [1,4])).toEqual([[1,4], [4,1]]));

});

const VERTEXES = BrushVertex.fromArrayToList([
  0,0,0, 1,0,0, 2,0,0,
  0,1,0, 1,1,0, 2,1,0,
  0,2,0, 1,2,0, 2,2,0
]);

const BRUSH = new BrushModel();

BRUSH.vertexes = VERTEXES;
BRUSH.polygons = POLYS;
BRUSH.buildAllPolygonEdges();

describe("create_brush_polygon", () => {

  [
    [4,5,8,7], [4,7,5,8], [5,7,8,4]
  ].forEach((selection) => test(`selection ${JSON.stringify(selection)} creates correct polygon`, () => {
    const result = createBrushPolygon(BRUSH, selection);
    const result_poly = result.polygons.find(p => p.vertexes.indexOf(8) !== -1);
    expect(result_poly).toBeTruthy();
    const edges_string = __extract_edges([result_poly], selection).map(edge => `${edge[0]}->${edge[1]}`);
    expect(edges_string).toContain("4->5");
    expect(edges_string).toContain("5->8");
    expect(edges_string).toContain("8->7");
    expect(edges_string).toContain("7->4");
  }));
  
});