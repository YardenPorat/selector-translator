import { type PSEUDO_CLASS_STATE } from './helpers/pseudo-classes';

export type PseudoClassName = keyof typeof PSEUDO_CLASS_STATE;
export interface PseudoClass {
    name: PseudoClassName;
    value?: string;
    offset?: string;
    step?: string;
}

export type Exist = 'exist';
export type AttributeAction = Exist | 'start' | 'end' | 'hyphen-list' | 'space-list' | 'equal' | 'contain';
export interface AttributeError {
    type: 'error';
    error: string;
}
export type AttributeDescriptor = (value: string) => string;
export interface Attribute {
    type: 'full' | Exist;
    action: AttributeAction;
    name: string;
    descriptor?: AttributeDescriptor;
    value?: string;
    casing?: boolean;
}
