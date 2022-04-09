import {
    useSignal, 
    useStyle, 
} from "../util"
import {
    getRegisteredClassCount, 
    renderStyleClassesCss, 
} from "./registerStyleClass"
import { themeColors } from "./themeColors"

export function useStyleClasses(): void {
    const classCount = getRegisteredClassCount()
    const colors = useSignal(themeColors)
    useStyle(renderStyleClassesCss(), [classCount, colors])
}
