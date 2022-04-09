import { renderStyleProperties } from './renderStyleProperties'
import { StyleProperties } from './StyleProperties'
import { themeColors, ThemeValueType } from './themeColors'

interface StyleClassProperties extends StyleProperties
{
    hover?: StyleProperties;
}

const names = new Set<string>()
const factories = new Array<{
    name: string,
    factory: (theme: ThemeValueType) => StyleClassProperties,
}>()

export function registerStyleClass(
    desiredClassName: string, 
    factory: (theme: ThemeValueType) => StyleClassProperties,
) : string{
    const name = getUniqueClassName(desiredClassName)
    names.add(name)
    factories.push({ name, factory })
    return name
}

export function getRegisteredClassCount(): number {
    return names.size
}

export function clearStyleClasses(): void {
    names.clear()
    factories.length = 0
}

export function renderStyleClassesCss(): string {
    const result = new Array<string>()
    for (const item of factories){
        const { name, factory } = item
        const properties = factory(themeColors.value)
        renderClassCss(result, name, properties)
    }
    if (result[result.length - 1] === '\n')
    {
        result.length -= 1
    }
    return result.join('')
}

function getUniqueClassName(desiredClassName: string): string {
    let name = desiredClassName
    let i=1
    while (names.has(name)){
        name = `${name}-${i}`
        i += 1
    }
    return name
}

function renderClassCss(result: string[], name: string, props: StyleClassProperties) {
    renderCssRule(result, ['.', name], props)
    if (props.hover)
    {
        renderCssRule(result, ['.', name, ':hover'], props.hover)
    }
}

function renderCssRule(result: string[], selector: string[], props:StyleProperties){
    const initialLength = result.length
    result.push(...selector)
    renderPropertiesIfNotEmpty(result, props, initialLength)
}

function renderPropertiesIfNotEmpty(result: string[], props: StyleProperties, undoLocation: number){
    renderStyleProperties(result, props)
    if (result.length >= 3 && result[result.length - 3] === '{' && result[result.length - 2] === '}')
    {
        // undo rule
        result.length = undoLocation
    }
}
