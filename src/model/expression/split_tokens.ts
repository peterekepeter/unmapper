
export function split_tokens(str_list: string[], regex: RegExp, options = { discard: false }): string[] {
    const result: string[] = [];
    if (options.discard) {
        for (const str of str_list) {
            result.push(...str.split(regex));
        }
    } else {
        for (const str of str_list) {
            let current_index = 0;
            let match: RegExpExecArray;
            while ((match = regex.exec(str)) !== null) {
                const match_begin = match.index;
                const match_end = regex.global
                    ? regex.lastIndex
                    : match_begin + match[0].length;
                if (current_index < match_begin) {
                    result.push(str.slice(current_index, match_begin));
                }
                if (match_begin < match_end) {
                    result.push(str.slice(match_begin, match_end));
                }
                current_index = match_end;
                if (!regex.global) {
                    break;
                }
            }
            if (current_index < str.length) {
                if (current_index === 0) {
                    // don't create new string
                    result.push(str);
                }
                else {
                    result.push(str.slice(current_index, str.length));
                }
            }
        }
    }
    return result;
}
