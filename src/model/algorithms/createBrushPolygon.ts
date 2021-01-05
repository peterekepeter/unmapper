import { BrushEdge } from "../BrushEdge";
import { BrushModel } from "../BrushModel";
import { BrushPolygon } from "../BrushPolygon";
import { BrushVertex } from "../BrushVertex";
import { calculate_polygon_median } from "./calculate_polygon_median";
import { calculate_polygon_normal } from "./calculate_polygon_normal";

export function createBrushPolygon(brush: BrushModel, selected_vertexes: number[]) : BrushModel {
    return createBrushPolygons(brush, [selected_vertexes]);
}

export function createBrushPolygons(old_brush: BrushModel, polygons_to_create: number[][]) : BrushModel {

    const new_brush = old_brush.shallowCopy();
    new_brush.edges = old_brush.edges.map(e => e.deep_copy());

    const new_polygons = polygons_to_create.map(vertex_list => createPolygon(old_brush, vertex_list));
    new_brush.polygons = [...old_brush.polygons, ...new_polygons];

    for (let i=old_brush.polygons.length; i<new_brush.polygons.length; i++){
        new_brush.rebuild_poly_edges(i);
    }

    return new_brush;
}

function createPolygon(brush: BrushModel, selected_vertexes: number[]) : BrushPolygon {
    // get neighbours to determine winding order
    const neighbours = brush.findPolygonsContaining({ min_vertex_match: 2, vertexes: selected_vertexes });
    const neighbour_edges = __extract_edges(neighbours, selected_vertexes);


    let new_vertex_index_list : number[];
    let index_list_error;
    let try_count = Math.min(selected_vertexes.length, 10);
    const rotating_selection = [...selected_vertexes];

    for (let i=0; i<try_count; i++){
        // retry loop for creating poly
        try {
            new_vertex_index_list = create_polygon_vertex_index_list(brush.vertexes, neighbour_edges, selected_vertexes);
            break;
        }
        catch (error){
            index_list_error = error;
            rotating_selection.unshift(rotating_selection.pop());
        }
    }

    if (!new_vertex_index_list){
        throw index_list_error || new Error("failed to create polygon");
    }
    
    const polygon = new BrushPolygon();

    //const pid = nextBrush.polygons.length;
    //nextBrush.polygons.push(newPoly);
    polygon.vertexes = new_vertex_index_list;
    polygon.median = calculate_polygon_median(brush.vertexes, polygon);
    polygon.origin = polygon.median;
    polygon.normal = calculate_polygon_normal(brush.vertexes, polygon);
    return polygon;
}

export function __extract_edges(polygons: BrushPolygon[], indexes: number[]): number[][]{
    const result:number[][] = [];
    for (const poly of polygons) {
        let last_vert = poly.vertexes[poly.vertexes.length-1];
        for (const vert of poly.vertexes) {
            if (indexes.indexOf(vert) !== -1 && indexes.indexOf(last_vert) !== -1){
                result.push([last_vert, vert]);
            }
            last_vert = vert;
        }
    }
    return result;
}

function create_polygon_vertex_index_list(
    vertexes: BrushVertex[], 
    neighbour_edges: number[][], 
    selected_vertexes: number[]):number[]{
    // neighbour edges must be contained in reverse order
    // all selected vertexes must be part of the new list
    const vertexes_to_add = [...selected_vertexes];
    const result : number[] = [vertexes_to_add.pop()];
    //console.log('start', selected_vertexes, 'from', result);

    while(vertexes_to_add.length > 0){
        // if only one vertex left, add it!
        if (vertexes_to_add.length == 1){
            result.push(vertexes_to_add.pop());
            //console.log('added last', result);
            continue; // ok, added vertex
        }
        const last_vertex = result[result.length-1];
        let added = false;
        //console.log('last_vertex', last_vertex)
        // see if we can find an edge which terminates in last_vertex
        for (const n_edge of neighbour_edges){
            if (n_edge[1] === last_vertex){
                const next_vertex = n_edge[0];
                vertexes_to_add.splice(vertexes_to_add.indexOf(next_vertex),1);
                result.push(next_vertex);
                //console.log(`added edge ${n_edge[1]}->${n_edge[0]}`, result);
                added = true;
                break; // ok, added vertex
            }
        }
        if (added){
            continue;
        }

        // no edge constraint for next vertex, find closest vertex of remaining ones
        const sorted_by_distance = vertexes_to_add
            .map(i => ({vertex_index: i, distance: vertexes[last_vertex].position.distanceTo(vertexes[i].position)}))
            .sort((a,b) => a.distance - b.distance);

        //console.log('distance to',last_vertex, "\n", sorted_by_distance);

        let next_vertex = -1;
        let next_invalid = true;
        for (const closest of sorted_by_distance){
            next_vertex = closest.vertex_index;
            next_invalid = false;
            // check that [last_vertex, next_vertex] does not invalidate any edge constraints
            for (const edge of neighbour_edges){
                if (edge[0] === last_vertex && edge[1] === next_vertex){
                    // poly already contains this vertex
                    next_invalid = true;
                    break;
                }
            }
            if (!next_invalid){
                break;
            }
        }
        if (!next_invalid)
        {
            vertexes_to_add.splice(vertexes_to_add.indexOf(next_vertex), 1);
            result.push(next_vertex);
            //console.log(`added nearest ${next_vertex}`, result);
            continue;
        }
        throw new Error('unable to construct polygon');
    }
    
    return result;
}