import type { Attribute, AttributeAction, AttributeDescriptor, AttributeError } from '../types';

export const EXIST = 'exist';
export const ERROR = 'error';
export const FULL = 'full';
const EQUAL = 'equal';
const EMPTY = 'empty';

export function parseAttribute(unparsedAttribute: string): AttributeError | Attribute {
    if (unparsedAttribute.trim() === '') {
        return { type: ERROR, error: `Empty attribute selector: '[${unparsedAttribute}]'` };
    }

    const splitterLocation = unparsedAttribute.indexOf('=');
    if (splitterLocation === -1) {
        return { type: EXIST, action: EXIST, name: unparsedAttribute };
    }

    const firstPart = unparsedAttribute.slice(0, splitterLocation);
    const secondPart = unparsedAttribute.slice(splitterLocation + 1);
    const { value, casing } = getValue(secondPart);
    if (firstPart.length === 0 || !value || secondPart.endsWith(':')) {
        return { type: ERROR, error: `Invalid attribute selector: '[${unparsedAttribute}]'` };
    }

    const modifier = firstPart.at(-1)!;
    const { action, descriptor } = getModifierType(modifier);
    const name = action === EQUAL ? firstPart : firstPart.slice(0, -1);

    return { type: FULL, action, name, value, casing, descriptor };
}

function getValue(valueAndCasing: string) {
    if (valueAndCasing.startsWith('"')) {
        const [_, value, casing] = valueAndCasing.split('"');
        return { value: value || EMPTY, casing: !!casing };
    }
    const [value, casing] = valueAndCasing.split(' ');
    return { value, casing: !!casing };
}

function getModifierType(modifier: string): { action: AttributeAction; descriptor: AttributeDescriptor } {
    if (modifier === '^')
        return { action: 'start', descriptor: (value: string) => `whose value starts with '${value}'` };

    if (modifier === '$')
        return {
            action: 'end',
            descriptor: (value: string) => `whose value ends with '${value}'`,
        };

    if (modifier === '|')
        return {
            action: 'hyphen-list',
            descriptor: (value: string) => `whose value '${value}' is included in a hyphen separated list`,
        };
    if (modifier === '~')
        return {
            action: 'space-list',
            descriptor: (value: string) => `whose value '${value}' is included in a space separated list`,
        };
    if (modifier === '*')
        return {
            action: 'contain',
            descriptor: (value: string) => `whose value contains '${value}'`,
        };

    return {
        action: EQUAL,
        descriptor: (value: string) => `whose value is ${value === EMPTY ? EMPTY : `'${value}'`}`,
    };
}
