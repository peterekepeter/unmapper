import { StyleProperties } from "./StyleProperties"

export function renderStyleProperties(result: string[], properties: StyleProperties): void {
    const p = properties
    result.push('{')

    if (p.color) { result.push('color:', p.color, ';') }
    if (p.background) { result.push('background:', p.background, ';') }
    if (p.border) { result.push('border:', p.border, ';') }
    if (p.borderTopColor) { result.push('border-top-color:', p.borderTopColor, ';') }
    if (p.boxShadow) { result.push('box-shadow:', p.boxShadow, ';') }
    if (p.borderRadius) { result.push('border-radius:', p.borderRadius, ';') }
    if (p.outline) { result.push('outline:', p.outline, ';') }
    if (p.cursor) { result.push('cursor:', p.cursor, ';') }
    if (p.textDecoration) { result.push('text-decoration:', p.textDecoration+'', ';') }
    if (p.fontFamily) { result.push('font-family:', p.fontFamily, ';') }
    if (p.userSelect) { result.push('user-select:', p.userSelect, ';') }

    if (result[result.length - 1] === ';') {
        result.length -= 1
    }
    result.push('}', '\n')
}
