import { joiner } from './string-manipulation';
import type { PseudoClass, PseudoClassName } from '../types';
import type { NthNode, SelectorNodes } from '@tokey/css-selector-parser';

export function parseStep(stepString: string) {
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
    hover: { state: 'hovered', text: '' },
    active: { state: 'active', text: 'Click on me!' },
    focus: { state: 'focused', text: 'Use with input / textarea' },
    visited: { state: 'visited', text: 'A link that was already clicked' },
    empty: { state: 'empty', text: '' },
    blank: { state: 'blank', text: '' },
    target: { state: 'targeted', text: '' },
    checked: { state: 'checked', text: '' },
    indeterminate: { state: 'indeterminate', text: '' },
    disabled: { state: 'disabled', text: '' },
    optional: { state: 'optional', text: 'Not required' },
    valid: { state: 'valid', text: 'Input value' },
    invalid: { state: 'invalid', text: '' },
    required: { state: 'required', text: '', attribute: 'required' },
    'read-only': { state: 'read-only', text: '', attribute: 'readonly' },
    'read-write': { state: 'read-write', text: 'Without readonly attribute' },
    'in-range': { state: 'in-range', text: '' },
    'out-of-range': { state: 'out-of-range', text: '' },
    lang: { state: 'language', text: '' },
    'last-child': { state: 'the last child of its parent', text: '' },
    'first-child': { state: 'the first child of its parent', text: '' },
    'only-child': { state: 'the only child of its parent', text: '' },
    'last-of-type': { state: 'the last of its type in its parent', text: '' },
    'first-of-type': { state: 'the first of its type in its parent', text: '' },
    'only-of-type': { state: 'the only of its type in its parent', text: '' },
    'nth-child': { state: 'child of its parent', text: '' },
    'nth-last-child': { state: 'child from the end of its parent', text: '' },
    'nth-of-type': { state: 'of its type in his parent', text: '' },
    'nth-last-of-type': { state: 'of its type from the end in his parent', text: '' },
};

export const PSEUDO_CLASS_ATTRIBUTES = {
    'read-only': 'readonly',
};

export type PseudoClassWithDifferentAttributeName = keyof typeof PSEUDO_CLASS_ATTRIBUTES;

function pseudoClassDescriptor({ name, value }: { name: PseudoClassName; value: string }) {
    // language is en
    return `${PSEUDO_CLASS_STATE[name].state} is '${value}'`;
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
    return `${stepText} ${type} starting with the ${offsetText} ${PSEUDO_CLASS_STATE[name].state} (inclusive)${directionText}`;
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
            return PSEUDO_CLASS_STATE[name].state;
        }

        return `'${name}' (unknown pseudo class)`;
    });

    if (state.length > 1) {
        return joiner(state);
    }
    return state[0];
}

function handleFormulas({ offset, step, name }: PseudoClass) {
    const { state } = PSEUDO_CLASS_STATE[name];
    if (offset && !step) {
        return `${offsetDescriptor(Number(offset))} ${state}`;
    }

    if (!offset && step) {
        return `${stepDescriptor(step)} ${state}`;
    }
    if (offset && step) {
        return nthAndStepDescriptor({ value: Number(offset), step, name });
    }

    throw new Error('Invalid pseudo class');
}

export interface ParsePseudoClassNodeResult {
    name: PseudoClassName;
    value: string;
    offset?: string;
    step?: string;
}
export function parsePseudoClassNode(value: string, secondLevelNodes: SelectorNodes | NthNode[]) {
    if (secondLevelNodes[0].type === 'type') {
        /** lang pseudo class */
        return {
            parsedPseudoClass: {
                name: value as PseudoClassName,
                value: secondLevelNodes[0].value,
                offset: undefined,
                step: undefined,
            },
        };
    } else {
        const formula = { offset: '', step: '' };
        for (const node of secondLevelNodes) {
            if (node.type === 'nth_offset') {
                formula.offset = node.value;
            } else if (node.type === 'nth_step') {
                formula.step = node.value;
            }
        }

        return {
            parsedPseudoClass: {
                name: value as PseudoClassName,
                ...formula,
            },
        };
    }
}
