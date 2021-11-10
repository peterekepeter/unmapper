import { tokenize_wavefront_obj as fn, WavefrontCommandToken as T } from "../tokenize_wavefront_obj"

test("vertex tokenization", () => {
    expect(fn("v 0.1 0.2 0.3"))
        .toEqual([T.BeginVertex, "0.1", "0.2", "0.3", T.End])
})

test("vertexes tokenization", () => {
    expect(fn("v 0.1 0.2 0.3\nv 0.4 0.5 0.6"))
        .toEqual([
            T.BeginVertex,
            "0.1",
            "0.2",
            "0.3",
            T.End, 
            T.BeginVertex,
            "0.4",
            "0.5",
            "0.6",
            T.End,
        ])
})

test("empty string results in empty token list", () => {
    expect(fn("")).toEqual([])
})

test("comment is ignored", () => {
    expect(fn("# Blender v2.92.0 OBJ File: ''")).toEqual([])
})

test("comment lines are ignored", () => {
    expect(fn(`
        # Blender v2.92.0 OBJ File: ''
        # www.blender.org
        o Plane
        # test
        o Cat
    `)).toEqual([
        T.BeginObject, 
        "Plane",
        T.End,
        T.BeginObject,
        "Cat",
        T.End,
    ])
})

test("object tokenization", () => 
    expect(fn("o Cat"))
        .toEqual([T.BeginObject, "Cat", T.End]))

test("object tokenization", () => 
    // eslint-disable-next-line spellcheck/spell-checker
    expect(fn("vt 0.875000 0.500000"))
        .toEqual([T.BeginVertexTexture, "0.875000", "0.500000", T.End]))

test("face tokenization with uv and normal", () => 
    expect(fn("f 1/1/1 3/2/1 4/3/1"))
        .toEqual([T.BeginPolygon, "1", "/", "1", "/", "1", "3", "/", "2", "/", "1", "4", "/", "3", "/", "1", T.End]))

test("face tokenization with uv", () => 
    expect(fn("f 1/1 3/2 4/3"))
        .toEqual([T.BeginPolygon, "1", "/", "1", "3", "/", "2", "4", "/", "3", T.End]))

test("face tokenization with normal", () => 
    expect(fn("f 1//1 3//1 4//1"))
        .toEqual([T.BeginPolygon, "1", "/", "/", "1", "3", "/", "/", "1", "4", "/", "/", "1", T.End]))

test("face just vertexes", () => 
    expect(fn("f 1 3 4"))
        .toEqual([T.BeginPolygon, "1", "3", "4", T.End]))
        
