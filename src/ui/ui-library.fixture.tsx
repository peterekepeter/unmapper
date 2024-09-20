import * as React from "react"

import { Vector } from "../model/Vector"
import { DropDown } from "./DropDown"
import { DropMenu } from "./DropMenu"
import { SectionTitle } from "./SectionTitle"
import { TextButton } from "./TextButton"
import { UiButton } from "./UiButton"
import { UiText } from "./UiText"
import { UiVectorInput } from "./UiVectorInput"


export const Hello: React.FC<{ greeting: string, name: string }> = ({ greeting, name }) => {
    return <h1>{greeting}, {name}!</h1>
}

const LibraryFixture = (): React.ReactElement => {
    const [vector, setVector] = React.useState(new Vector(124, 421, 32))
    const [previewVector, setPreviewVector] = React.useState(new Vector(124, 421, 32))
    const [option, setOption] = React.useState("test")
    return <>
        <div>
            <Title>Typography</Title>
            <UiText>
                Basic UiText element. 
                The quick brown fox jumps over the lazy dog!
            </UiText>
        </div>
        <div>
            <Title>Vector Input</Title>
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
            <Title>Buttons</Title>
            <UiButton>Button</UiButton>
            <UiText> disabled: </UiText>
            <UiButton disabled>Button</UiButton>
        </div>
        <div>
            <Title>Text Buttons</Title>
            <TextButton>Button</TextButton>
            <UiText> disabled: </UiText>
            <TextButton disabled>Button</TextButton>
        </div>
        <div>
            <Title>dropdown</Title>
            <DropDown value={option} options={["test", "another", "yet-another"]} onchange={setOption}></DropDown>
            <UiText>Current value: {option}</UiText>
        </div>
        <div>
            <Title>drop menu</Title>
            <DropMenu></DropMenu>
        </div>
    </>
}

const Title: React.FC<{ children?: React.ReactNode }> = props => 
    <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <SectionTitle>
            {props.children}
        </SectionTitle>
    </div>

export default LibraryFixture
