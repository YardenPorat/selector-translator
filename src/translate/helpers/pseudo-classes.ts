import { joiner } from './string-manipulation';
import { IS, NOT, WHERE } from '../../consts';
import type { PseudoClass, PseudoClassName } from '../types';
import type { NthNode, SelectorNodes } from '@tokey/css-selector-parser';

const WHEN_ITS = 'when its';
const WHEN_ITS_A = WHEN_ITS + ' a';
const CLASSNAME_PREFIX = 'with a';

export const PSEUDO_CLASS_STATE = {
    hover: { state: 'hovered', text: '', prefix: WHEN_ITS },
    link: { state: 'a link', text: `'a' or 'area' element`, prefix: WHEN_ITS_A },
    active: { state: 'active', text: 'Click on me!', prefix: WHEN_ITS },
    focus: { state: 'focused', text: 'Use with input / textarea', prefix: WHEN_ITS },
    visited: { state: 'visited', text: 'A link that was already clicked', prefix: WHEN_ITS },
    empty: { state: 'empty', text: '', prefix: WHEN_ITS },
    blank: { state: 'blank', text: '', prefix: WHEN_ITS },
    target: { state: 'targeted', text: '', prefix: WHEN_ITS },
    checked: { state: 'checked', text: '', prefix: WHEN_ITS },
    indeterminate: { state: 'indeterminate', text: '', prefix: WHEN_ITS },
    disabled: { state: 'disabled', text: '', prefix: WHEN_ITS },
    optional: { state: 'optional', text: 'Not required', prefix: WHEN_ITS },
    valid: { state: 'valid', text: 'Input value', prefix: WHEN_ITS },
    invalid: { state: 'invalid', text: '', prefix: WHEN_ITS },
    required: { state: 'required', text: '', attribute: 'required', prefix: WHEN_ITS },
    'read-only': { state: 'read-only', text: '', attribute: 'readonly', prefix: WHEN_ITS },
    'read-write': { state: 'read-write', text: 'Without readonly attribute', prefix: WHEN_ITS },
    'in-range': { state: 'in-range', text: '', prefix: WHEN_ITS },
    'out-of-range': { state: 'out-of-range', text: '', prefix: WHEN_ITS },
    lang: { state: 'language', text: '', prefix: WHEN_ITS },
    'last-child': { state: 'the last child of its parent', text: '', prefix: WHEN_ITS },
    'first-child': { state: 'the first child of its parent', text: '', prefix: WHEN_ITS },
    'only-child': { state: 'the only child of its parent', text: '', prefix: WHEN_ITS },
    'last-of-type': { state: 'the last child of its type in its parent', text: '', prefix: WHEN_ITS },
    'first-of-type': { state: 'the first child of its type in its parent', text: '', prefix: WHEN_ITS },
    'only-of-type': { state: 'the only of its type in its parent', text: '', prefix: WHEN_ITS },
    'nth-child': { state: 'child of its parent', text: '', prefix: WHEN_ITS },
    'nth-last-child': { state: 'child from the end of its parent', text: '', prefix: WHEN_ITS },
    'nth-of-type': { state: 'child of its type in his parent', text: '', prefix: WHEN_ITS },
    'nth-last-of-type': { state: 'child of its type from the end in his parent', text: '', prefix: WHEN_ITS },
    [NOT]: { state: NOT, text: '', prefix: WHEN_ITS },
    [WHERE]: { state: 'where its', text: '', prefix: '' },
    [IS]: { state: 'who', text: '', prefix: '' },
};

export const PSEUDO_CLASS_ATTRIBUTES = {
    'read-only': 'readonly',
};

function offsetDescriptor(value: number) {
    return `the ${value}${getNumberSuffix(value)}`;
}

export function parseStep(stepString: string) {
    const stepSign = stepString.includes('-') ? -1 : 1;
    return (Number(stepString.toLowerCase().replace('n', '').replace('-', '')) || 1) * stepSign;
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

export function getPseudoClassesPrefix(pseudoClasses: PseudoClass[], pseudoClassString: string, noPrefix?: boolean) {
    if (noPrefix || pseudoClassString.startsWith(CLASSNAME_PREFIX)) {
        return '';
    }

    for (const pseudoClass of pseudoClasses) {
        if ([IS].some((p) => p === pseudoClass.name)) {
            return '';
        }
    }

    return `${WHEN_ITS} `;
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
            if (name === NOT) {
                return `${state} ${value}`;
            }

            if ([WHERE].some((pseudoClassName) => pseudoClassName === name)) {
                return value;
            }

            if ([IS].some((pseudoClassName) => pseudoClassName === name)) {
                if (value.startsWith(CLASSNAME_PREFIX)) {
                    return value;
                }

                // Any element who is a <main> element
                return `${state} is ${value}`;
            }

            // language is 'en'
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
