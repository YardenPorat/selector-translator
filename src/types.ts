import { type PSEUDO_CLASS_STATE } from './helpers/pseudo-classes';

export type PseudoClassName = keyof typeof PSEUDO_CLASS_STATE;
export interface PseudoClass {
    name: PseudoClassName;
    value?: string;
    offset?: string;
    step?: string;
}
