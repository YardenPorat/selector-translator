import { PseudoClassName } from '../types';

export const PSEUDO_CLASS_STATE = {
    hover: 'hovered',
    active: 'active',
    focus: 'focused',
    visited: 'visited',
    empty: 'empty',
    blank: 'blank',
    target: 'targeted',
    checked: 'checked',
    indeterminate: 'indeterminate',
    disabled: 'disabled',
    optional: 'optional',
    valid: 'valid',
    invalid: 'invalid',
    required: 'required',
    'read-only': 'read-only',
    'read-write': 'read-write',
    'in-range': 'in-range',
    'out-of-range': 'out-of-range',
    lang: 'language',
};

interface PseudoClassDescOptions {
    name: PseudoClassName;
    value: string;
}

export function pseudoClassDescriptor({ name, value }: PseudoClassDescOptions) {
    return `${PSEUDO_CLASS_STATE[name]} is '${value}'`;
}
