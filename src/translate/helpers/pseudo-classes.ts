import { joiner } from './string-manipulation';
import type { PseudoClass, PseudoClassName } from '../types';
import type { NthNode, SelectorNodes } from '@tokey/css-selector-parser';

export function parseStep(stepString: string) {
    const stepSign = stepString.includes('-') ? -1 : 1;
    return (Number(stepString.toLowerCase().replace('n', '').replace('-', '')) || 1) * stepSign;
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
    'last-of-type': { state: 'the last child of its type in its parent', text: '' },
    'first-of-type': { state: 'the first child of its type in its parent', text: '' },
    'only-of-type': { state: 'the only of its type in its parent', text: '' },
    'nth-child': { state: 'child of its parent', text: '' },
    'nth-last-child': { state: 'child from the end of its parent', text: '' },
    'nth-of-type': { state: 'child of its type in his parent', text: '' },
    'nth-last-of-type': { state: 'child of its type from the end in his parent', text: '' },
    not: { state: 'not', text: '' },
    where: { state: 'where its', text: '' },
};

export const PSEUDO_CLASS_ATTRIBUTES = {
    'read-only': 'readonly',
};

export type PseudoClassWithDifferentAttributeName = keyof typeof PSEUDO_CLASS_ATTRIBUTES;

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
    offset: number;
    step: string;
    name: PseudoClassName;
}
function nthAndStepDescriptor({ offset, step: stepString, name }: OffsetAndStepDescOptions) {
    const step = parseStep(stepString);
    const stepText = stepDescriptor(stepString);
    const offsetText = `${offset}${getNumberSuffix(offset)}`;
    const type = name.includes('child') ? 'child' : 'child of type';
    const directionText =
        step < 0 && name.includes('last') ? '' : step < 0 || name.includes('last') ? ', going down' : '';
    if (offset) {
        return `${stepText} ${type} starting with the ${offsetText} ${PSEUDO_CLASS_STATE[name].state} (inclusive)${directionText}`;
    }

    const nonShown = step < 0 ? ' (non shown because selection starts at 0, going down)' : '';
    return `${stepText} ${PSEUDO_CLASS_STATE[name].state}${directionText}${nonShown}`;
}

export function getPseudoClassesString(pseudoClasses: PseudoClass[]) {
    const state = pseudoClasses.map(({ name, value, offset, step }) => {
        if (offset || step) {
            return handleFormulas({ offset, step, name });
        }
        const state = PSEUDO_CLASS_STATE[name]?.state;

        if (!state) {
            return `${name} (unknown pseudo class)`;
        }

        if (value) {
            if (name === 'not') {
                const descriptor = `${state}${state ? ' ' : ''}${value}`;
                return descriptor;
            }

            if (name === 'where') {
                return value;
            }

            // language is en
            return `${state} is '${value}'`;
        }

        return `${state}`;
    });

    return state.length > 1 ? joiner(state) : state[0];
}

function handleFormulas({ offset, step, name }: PseudoClass) {
    const { state } = PSEUDO_CLASS_STATE[name];
    if (offset && !step) {
        return `${offsetDescriptor(Number(offset))} ${state}`;
    }

    if (step) {
        return nthAndStepDescriptor({ offset: Number(offset), step, name });
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
        let dash = '';
        for (const node of secondLevelNodes) {
            if (node.type === 'nth_offset') {
                if (dash) {
                    formula.offset = dash + node.value;
                    dash = '';
                } else {
                    formula.offset = node.value;
                }
            } else if (node.type === 'nth_step') {
                formula.step = node.value;
            } else if (node.type === 'nth_dash') {
                dash = node.value;
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
