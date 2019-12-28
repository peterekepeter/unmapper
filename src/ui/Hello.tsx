import * as React from "react";
import styled from 'styled-components';

export interface HelloProps { compiler: string; framework: string; }

export const Hello = (props: HelloProps) => <MainTitle>Hello from {props.compiler} and {props.framework}!</MainTitle>;

const MainTitle = styled.h1`
    font-family: sans-serif
`;