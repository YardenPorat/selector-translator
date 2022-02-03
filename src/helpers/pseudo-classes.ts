import { joiner } from './joiner';
import type { PseudoClass } from '../types';

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
    'last-child': 'the last child of its parent',
    'first-child': 'the first child of its parent',
    'only-child': 'the only child of its parent',
    'nth-child': 'the nth child (formula) of its parent',
    'nth-last-child': 'the nth (formula) child from the end of its parent',
    'last-of-type': 'the last of its type in its parent',
    'first-of-type': 'the first of its type in its parent',
    'only-of-type': 'the only of its type in its parent',
    'nth-of-type': 'the nth (formula) of its type in its parent',
    'nth-last-of-type': 'the nth (formula) of its type in its parent, from the end',
};

export function pseudoClassDescriptor({ name, value }: PseudoClass) {
    return `${PSEUDO_CLASS_STATE[name]} is '${value}'`;
}

export function getPseudoClassesString(pseudoClasses: PseudoClass[]) {
    const state = pseudoClasses.map(({ name, value }) => {
        if (value) {
            return pseudoClassDescriptor({ name, value });
        }
        if (PSEUDO_CLASS_STATE[name]) {
            return PSEUDO_CLASS_STATE[name];
        }

        return `when it is '${name}' (unknown pseudo class)`;
    });

    if (state.length > 1) return joiner(state);
    return state[0];
}
