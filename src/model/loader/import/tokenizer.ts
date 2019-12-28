


export function tokenize(input : string) : string[] {
    const result : string[] = [];
    const length = input.length;
    
    let tokenStart = 0, i;
    let isInWhitespace = true;
    let prevChr = '';
    for (i=0; i<length; i++){
        const chr = input[i];
        let split = false, save = true;
        if (isInWhitespace){
            if (!isWhitespaceChar(chr)){
                split = true;
                isInWhitespace = false;
                save = false;
            }
        }
        else {
            if (isWhitespaceChar(chr)){
                split = true;
                isInWhitespace = true;
            } else if (isOperator(chr)){
                split = true;
            }
            else if (isOperator(prevChr)) {
                split = true;
            }
        }

        if (split){
            if (save && tokenStart != i){
                result.push(input.substring(tokenStart, i));
            }
            tokenStart = i;
        }

        prevChr = chr;
    }

    // save the last token
    if (!isInWhitespace && tokenStart != i){
        result.push(input.substring(tokenStart, i));
    }

    tokenStart = i;
    return result;
}

function isWhitespaceChar(s:string){
    return s === ' ' || s === '\n' || s === '\t';
}

function isOperator(s:string){
    return s === '=' || s === '(' || s === ')' || s === ',';
}