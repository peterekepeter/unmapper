
export enum WavefrontCommandToken {
    End = "EOL",
    UseMaterialLibrary = "mtllib",
    BeginObject = "o",
    BeginVertex = "v",
    BeginVertexTexture = "vt",
    BeginVertexNormal = "vn",
    UseMaterial = "usemtl",
    SmoothShading = "s",
    BeginPolygon = "f",
    BeginLine = "l",
}

export type WavefrontToken = WavefrontCommandToken | string

export function tokenize_wavefront_obj(input: string): WavefrontToken[] {
    const result: WavefrontToken[] = []
    const length = input.length

    let tokenStart = 0, i = 0
    let in_whitespace = true
    let in_comment = false
    let prevChr = ''
    for (i = 0; i < length; i++) {
        const char = input[i]
        let split = false, save_split = true

        if (in_comment){
            if (char === "\n"){
                in_comment = false
                save_split = false
                split = true
            }
        }
        else if (in_whitespace) {
            if (char === '#'){
                in_comment = true
                in_whitespace = false
                save_split = false
                split = false
            } else if (!isUselessSpace(char)) {
                split = true
                in_whitespace = false
                in_comment = false
                save_split = false
            } 
        }
        else {
            if (char === '#'){
                in_comment = true
                in_whitespace = false
                save_split = true
                split = true
            } else if (isUselessSpace(char)) {
                split = true
                in_whitespace = true
            } else if (isOperator(char)) {
                split = true
            }
            else if (isOperator(prevChr)) {
                split = true
            }
        }

        if (split) {
            if (save_split && tokenStart != i) {
                push_token_to_result()
            }
            tokenStart = i
        }

        prevChr = char
    }

    // save the last token
    if (!in_whitespace && !in_comment && tokenStart != i) {
        push_token_to_result()
    }

    if (result.length > 0 && result[result.length-1] !== WavefrontCommandToken.End){
        result.push(WavefrontCommandToken.End)
    }

    tokenStart = i
    return result

    function push_token_to_result(){
        const token = to_token(input.substring(tokenStart, i))
        if (token === WavefrontCommandToken.End) {
            const lastResult = result[result.length -1]
            if (lastResult !== WavefrontCommandToken.End && lastResult != null){
                result.push(token)
            }
        }
        else {
            result.push(token)
        }
    }
}

function isUselessSpace(s: string): boolean {
    return s === ' ' || s === '\r' || s === '\t'
}

function isOperator(s: string) {
    return s === '/' || s === '\n'
}

function to_token(word: string): WavefrontToken {
    switch (word) {
        case "o": return WavefrontCommandToken.BeginObject
        case "v": return WavefrontCommandToken.BeginVertex
        // eslint-disable-next-line spellcheck/spell-checker
        case "vt": return WavefrontCommandToken.BeginVertexTexture
        // eslint-disable-next-line spellcheck/spell-checker
        case "vn": return WavefrontCommandToken.BeginVertexNormal
        // eslint-disable-next-line spellcheck/spell-checker
        case "usemtl": return WavefrontCommandToken.UseMaterial
        // eslint-disable-next-line spellcheck/spell-checker
        case "mtllib": return WavefrontCommandToken.UseMaterialLibrary
        case "f": return WavefrontCommandToken.BeginPolygon
        case "l": return WavefrontCommandToken.BeginLine
        case "s": return WavefrontCommandToken.SmoothShading
        case "\n": return WavefrontCommandToken.End
        default: return word
    }

}
