import { joiner } from './joiner';
import type { PseudoClass, PseudoClassName } from '../types';

function parseStep(stepString: string) {
    const stepSign = stepString.includes('-') ? -1 : 1;
    return (Number(stepString.replace('n', '').replace('-', '')) || 1) * stepSign;
}

function getNumberSuffix(n: number) {
    if (n > 3 && n < 21) {
        return 'th';
    }

    const asString = n.toString();
    if (asString.at(-1) === '1') {
        return 'st';
    }
    if (asString.at(-1) === '2') {
        return 'nd';
    }
    if (asString.at(-1) === '3') {
        return 'rd';
    }
    return 'th';
}

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
    'last-of-type': 'the last of its type in its parent',
    'first-of-type': 'the first of its type in its parent',
    'only-of-type': 'the only of its type in its parent',
    'nth-child': 'child of its parent',
    'nth-last-child': 'child from the end of its parent',
    'nth-of-type': 'of its type in his parent',
    'nth-last-of-type': 'of its type from the end in his parent',
};

function pseudoClassDescriptor({ name, value }: { name: PseudoClassName; value: string }) {
    return `${PSEUDO_CLASS_STATE[name]} is '${value}'`;
}

function offsetDescriptor(value: number) {
    return `the ${value}${getNumberSuffix(value)}`;
}

function stepDescriptor(stepString: string) {
    if (['odd', 'even'].includes(stepString)) {
        return `every ${stepString}`;
    }
    const step = parseStep(stepString);
    const stepDescriptor = step === -1 || step === 1 ? '' : ` ${Math.abs(step)}${getNumberSuffix(step)}`;

    return `every${stepDescriptor}`;
}

interface OffsetAndStepDescOptions {
    value: number;
    step: string;
    name: PseudoClassName;
}

function nthAndStepDescriptor({ value, step: stepString, name }: OffsetAndStepDescOptions) {
    const step = parseStep(stepString);
    const stepText = stepDescriptor(stepString);
    const offsetText = `${value}${getNumberSuffix(value)}`;
    const type = name.includes('child') ? 'child' : 'child of type';
    const directionText =
        step < 0 && name.includes('last') ? '' : step < 0 || name.includes('last') ? ', going down' : '';
    return `${stepText} ${type} starting with the ${offsetText} ${PSEUDO_CLASS_STATE[name]} (inclusive)${directionText}`;
}

export function getPseudoClassesString(pseudoClasses: PseudoClass[]) {
    const state = pseudoClasses.map(({ name, value, offset, step }) => {
        if (offset || step) {
            return handleFormulas({ offset, step, name });
        }
        if (value && PSEUDO_CLASS_STATE[name]) {
            return pseudoClassDescriptor({ name, value });
        }

        if (PSEUDO_CLASS_STATE[name]) {
            return PSEUDO_CLASS_STATE[name];
        }

        return `'${name}' (unknown pseudo class)`;
    });

    if (state.length > 1) {
        return joiner(state);
    }
    return state[0];
}

function handleFormulas({ offset, step, name }: PseudoClass) {
    if (offset && !step) {
        return `${offsetDescriptor(Number(offset))} ${PSEUDO_CLASS_STATE[name]}`;
    }

    if (!offset && step) {
        return `${stepDescriptor(step)} ${PSEUDO_CLASS_STATE[name]}`;
    }
    if (offset && step) {
        return nthAndStepDescriptor({ value: Number(offset), step, name });
    }

    throw new Error('Invalid pseudo class');
}
