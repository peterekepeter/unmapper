import { Vector } from "../../model/Vector"

/** defines the possible snap types and its metadata */
export type SnapResult = { type: 'Vertex'; } 
| { type: 'Edge'; vertex_a: Vector; vertex_b: Vector; } 
| { type: 'EdgeMidpoint'; vertex_a: Vector; vertex_b: Vector; } 
| { type: 'ActorOrigin'; actor_index: number; }
| { type: 'LineIntersection'; line_a_0: Vector, line_a_1: Vector, line_b_0: Vector, line_b_1: Vector }
| { type: 'LineRightAngle'; line_0: Vector, line_1: Vector, from: Vector }
    
