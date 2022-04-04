import * as React from "react"

import { Vector } from "../model/Vector"
import { SectionTitle } from "./SectionTitle"
import { UiActorClass } from "./UiActorClass"
import { UiButton } from "./UiButton"
import { UiText } from "./UiText"
import { UiVectorInput } from "./UiVectorInput"


// export const Hello: FC<{ greeting: string, name: string }> = ({ greeting, name }) => {
//     return <h1>{greeting}, {name}!</h1>
// }

const LibraryFixture = (): React.ReactElement => {
    const [vector, setVector] = React.useState(new Vector(124, 421, 32))
    const [previewVector, setPreviewVector] = React.useState(new Vector(124, 421, 32))
    return <>
        <div>
            <SectionTitle>Typography</SectionTitle>
            <UiText>
                Basic UiText element. 
                The quick brown fox jumps over the lazy dog!
            </UiText>
        </div>
        <div>
            <SectionTitle>Vector Input</SectionTitle>
            <UiVectorInput
                value={vector}
                next_value={setVector}
                preview_value={setPreviewVector}
            />
            <UiText>Value:</UiText>
            <UiVectorInput value={vector}></UiVectorInput>
            <UiText>Preview:</UiText>
            <UiVectorInput value={previewVector}></UiVectorInput>
        </div>
        <div>
            <SectionTitle>Buttons</SectionTitle>
            <UiButton>Button</UiButton>
        </div>
        <div>
            <SectionTitle>UiActorClass</SectionTitle>
            <UiActorClass>Button</UiActorClass>
        </div>
    </>
}

export default LibraryFixture
