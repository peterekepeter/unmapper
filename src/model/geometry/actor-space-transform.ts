import { Actor } from "../Actor"
import { Matrix3x3 } from "../Matrix3x3"
import { Vector } from "../Vector"


export const get_actor_to_world_transform = get_actor_to_world_transform_optimized

export const get_world_to_actor_transform = get_world_to_actor_transform_simple

export function get_world_to_actor_rotation_scaling(actor: Actor): Matrix3x3 {

    const { postScale, rotation, mainScale } = actor

    return mainScale.to_inv_matrix()
        .multiply(rotation.to_inv_matrix())
        .multiply(postScale.to_inv_matrix())
}

export function get_actor_to_world_rotation_scaling(actor: Actor): Matrix3x3 {

    const { postScale, rotation, mainScale } = actor

    return postScale.to_matrix()
        .multiply(rotation.to_matrix())
        .multiply(mainScale.to_matrix())
}

export function get_world_to_actor_transform_simple(
    actor: Actor
): (v: Vector) => Vector {

    const pivot = actor.prePivot || Vector.ZERO
    const location = actor.location || Vector.ZERO

    const matrix = get_world_to_actor_rotation_scaling(actor)

    return v => matrix.apply(v.subtract_vector(location))
        .add_vector(pivot)
}

export function get_actor_to_world_transform_simple(
    actor: Actor
): (v: Vector) => Vector {

    const matrix = get_actor_to_world_rotation_scaling(actor)
    const pivot = actor.prePivot || Vector.ZERO
    const location = actor.location || Vector.ZERO

    return v => matrix.apply(v.subtract_vector(pivot))
        .add_vector(location)
}

export function get_actor_to_world_transform_optimized(
    actor: Actor
): (v: Vector) => Vector {

    const matrix = get_actor_to_world_rotation_scaling(actor)
    const pivot = actor.prePivot || Vector.ZERO
    const location = actor.location || Vector.ZERO

    // optimization
    {
        if (matrix.equals(Matrix3x3.IDENTITY)){
            // matrix math not required
            const translate = location.subtract_vector(pivot);
            if (translate.equals(Vector.ZERO)){
                // identity transnform detected!
                return v => v
            }
            return v => v.add_vector(translate)
        }
    
        if (matrix.is_scaling_matrix()){
            if (matrix.is_uniform_scaling_matrix()){
                const scale = matrix.m00
                if (pivot.equals(Vector.ZERO)){
                    if (location.equals(Vector.ZERO)){
                        return v => v.scale(scale)
                    }
                    return v => v.scale(scale).add_vector(location)
                }
                return v => v.subtract_vector(pivot).scale(scale).add_vector(location)
            } 
            const scale_vector = new Vector(matrix.m00, matrix.m11, matrix.m22)
            if (pivot.equals(Vector.ZERO)){
                if (location.equals(Vector.ZERO)){
                    return v => v.scale_components(scale_vector)
                }
                return v => v.scale_components(scale_vector).add_vector(location)
            }
            return v => v.subtract_vector(pivot).scale_components(scale_vector).add_vector(location)
        }
    
        if (pivot.equals(Vector.ZERO)) {
            if (location.equals(Vector.ZERO)) {
                // no pivot & no location, just matrix
                return v => matrix.apply(v)
            }
            // no pivot 
            return v => matrix.apply(v).add_vector(location)
        }
    }

    // general case
    return (v: Vector) =>
        matrix.apply(v.subtract_vector(pivot))
            .add_vector(location)
}