


export function tokenize(input: string): string[] {
    const result: string[] = [];
    const length = input.length;

    let tokenStart = 0, i;
    let isInWhitespace = true;
    let isInStringQuotes = false;
    let prevChr = '';
    for (i = 0; i < length; i++) {
        const chr = input[i];
        let split = false, save = true;

        if (isInStringQuotes) {
            if (prevChr === '"') {
                split = true;
                save = false;
            }
            else if (chr === '"') {
                isInStringQuotes = false;
                split = true;
            }
        }
        else if (isInWhitespace) {
            if (chr === '"') {
                isInStringQuotes = true;
                isInWhitespace = false;
                split = true;
                save = false;
            } else if (!isWhitespaceChar(chr)) {
                split = true;
                isInWhitespace = false;
                save = false;
            }
        }
        else {
            if (prevChr === '"'){
                save = false;
                split = true;
            } 
            if (isWhitespaceChar(chr)) {
                split = true;
                isInWhitespace = true;
            } else if (isOperator(chr)) {
                split = true;
            }
            else if (chr === '"') {
                isInStringQuotes = true;
                split = true;
            }
            else if (isOperator(prevChr)) {
                split = true;
            }
        }

        if (split) {
            if (save && tokenStart != i) {
                result.push(input.substring(tokenStart, i));
            }
            tokenStart = i;
        }

        prevChr = chr;
    }

    // save the last token
    if (!isInWhitespace && tokenStart != i && prevChr != '"') {
        result.push(input.substring(tokenStart, i));
    }

    tokenStart = i;
    return result;
}

function isWhitespaceChar(s: string) {
    return s === ' ' || s === '\r' || s === '\n' || s === '\t';
}

function isOperator(s: string) {
    return s === '=' || s === '(' || s === ')' || s === ',';
}