import { Vector } from "../../model/Vector"
import { deep_freeze } from "../../util/deep_freeze"

/** defines the possible snap types and its metadata */
export type SnapResult = { type: 'None'; } 
| { type: 'Legacy'; } 
| { type: 'Vertex'; } 
| { type: 'Edge'; vertex_a: Vector; vertex_b: Vector; } 
| { type: 'EdgeMidpoint'; vertex_a: Vector; vertex_b: Vector; } 
| { type: 'ActorOrigin'; actor_index: number; }
| { type: 'LineIntersection'; line_a_0: Vector, line_a_1: Vector, line_b_0: Vector, line_b_1: Vector }
| { type: 'LineRightAngle'; line_0: Vector, line_1: Vector, from: Vector }
| { type: 'PolygonMean'; }
    
export const DEFAULT_SNAP_RESULT : SnapResult = { type: 'None' }

deep_freeze(DEFAULT_SNAP_RESULT)
