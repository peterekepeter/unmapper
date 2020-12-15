import { BrushModel } from "../BrushModel";
import { BrushPolygon } from "../BrushPolygon";
import { BrushVertex } from "../BrushVertex";


export function createBrushPolygon(oldBrush: BrushModel, selected_vertexes: number[]){
    if (selected_vertexes.length < 3){
        return oldBrush; // need at least 3 vertexes to form a new polygon
    }

    const nextBrush = oldBrush.shallowCopy();
    const newPoly = new BrushPolygon();
    

    // get neighbours to determine winding order
    const neighbours = nextBrush.findPolygonsContaining({ min_vertex_match: 2, vertexes: selected_vertexes });
    const neighbour_edges = __extract_edges(neighbours, selected_vertexes);

    const pid = nextBrush.polygons.length;
    nextBrush.polygons = [...oldBrush.polygons, newPoly];
    newPoly.vertexes = create_polygon_vertex_index_list(nextBrush.vertexes, neighbour_edges, selected_vertexes);
    nextBrush.calculatePolygonMedian(pid);
    newPoly.origin = newPoly.median;
    nextBrush.buildAllPolygonEdges();
    return nextBrush;
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
    console.log('start', selected_vertexes, 'from', result);

    while(vertexes_to_add.length > 0){
        // if only one vertex left, add it!
        if (vertexes_to_add.length == 1){
            result.push(vertexes_to_add.pop());
            console.log('added last', result);
            continue; // ok, added vertex
        }
        const last_vertex = result[result.length-1];
        // see if we can find an edge which terminates in last_vertex
        for (const n_edge of neighbour_edges){
            if (n_edge[1] === last_vertex){
                const next_vertex = n_edge[0];
                vertexes_to_add.splice(vertexes_to_add.indexOf(next_vertex),1);
                result.push(next_vertex);
                console.log(`added edge ${n_edge[1]}->${n_edge[0]}`, result);
                continue; // ok, added vertex
            }
        }

        // no edge constraint for next vertex, find closest vertex of remaining ones
        const sorted_by_distance = vertexes_to_add
            .map(i => ({vertex_index: i, distance: vertexes[last_vertex].position.distanceTo(vertexes[i].position)}))
            .sort((a,b) => b.distance - a.distance);

        console.log(sorted_by_distance);

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
            console.log(`added nearest ${next_vertex}`, result);
            continue;
        }
        throw new Error('unable to construct polygon');
    }
    
    return result;
}