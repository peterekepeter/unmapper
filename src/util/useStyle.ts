import { useEffect } from "react"


export function useStyle(
    css: string, 
    dependencies: unknown[] = [],
): void {
    useEffect(() => {
        const element = document.createElement('style')
        element.textContent = css
        document.head.appendChild(element)
        return () => void document.head.removeChild(element)
    }, dependencies)
}
