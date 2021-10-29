import { Vector } from "../../model/Vector"

/** defines the possible snap types and its metadata */
export type SnapResult = { type: 'Vertex'; } 
| { type: 'Edge'; vertex_a: Vector; vertex_b: Vector; } 
| { type: 'EdgeMidpoint'; vertex_a: Vector; vertex_b: Vector; } 
| { type: 'ActorOrigin'; actor_index: number; }
    
