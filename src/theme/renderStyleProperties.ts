import { StyleProperties } from "./StyleProperties"

export function renderStyleProperties(result: string[], properties: StyleProperties): void {
    const p = properties
    result.push('{')

    if (p.background) { result.push('background:', p.background, ';') }
    if (p.border) { result.push('border:', p.border, ';') }
    if (p.borderRadius) { result.push('border-radius:', p.borderRadius, ';') }
    if (p.borderTopColor) { result.push('border-top-color:', p.borderTopColor, ';') }
    if (p.bottom) { result.push('bottom', p.bottom, ';') }
    if (p.boxShadow) { result.push('box-shadow:', p.boxShadow, ';') }
    if (p.color) { result.push('color:', p.color, ';') }
    if (p.cursor) { result.push('cursor:', p.cursor, ';') }
    if (p.display) { result.push('display:', p.display, ';') }
    if (p.fontFamily) { result.push('font-family:', p.fontFamily, ';') }
    if (p.height) { result.push('height:', p.height, ';') }
    if (p.left) { result.push('left', p.left, ';') }
    if (p.margin) { result.push('margin:', p.margin, ';') }
    if (p.outline) { result.push('outline:', p.outline, ';') }
    if (p.padding) { result.push('padding:', p.padding, ';') }
    if (p.position) { result.push('position:', p.position, ';') }
    if (p.right) { result.push('right', p.right, ';') }
    if (p.textDecoration) { result.push('text-decoration:', p.textDecoration+'', ';') }
    if (p.top) { result.push('top', p.top, ';') }
    if (p.userSelect) { result.push('user-select:', p.userSelect, ';') }
    if (p.width) { result.push('width:', p.width, ';') }
    if (p.zIndex) { result.push('z-index:', String(p.zIndex), ';') }

    if (result[result.length - 1] === ';') {
        result.length -= 1
    }
    result.push('}', '\n')
}
