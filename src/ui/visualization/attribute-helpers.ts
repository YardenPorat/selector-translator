import { PSEUDO_CLASS_ATTRIBUTES } from '../../translate/helpers/pseudo-classes';
import type { VisualizationElement } from './create-element';

export interface AddAttributesArgs {
    keyValues: [string, string][];
    currentElement: VisualizationElement;
}
export function addAttributes({ keyValues, currentElement }: AddAttributesArgs) {
    if (!currentElement.attributes) {
        currentElement.attributes = {};
    }

    for (const [key, value] of keyValues) {
        currentElement.attributes[key] = value;
    }
}

export function getAttributeDomName(value: string) {
    if (Object.keys(PSEUDO_CLASS_ATTRIBUTES).includes(value)) {
        return PSEUDO_CLASS_ATTRIBUTES[value as keyof typeof PSEUDO_CLASS_ATTRIBUTES];
    }
    return value;
}

export function getAttribute(attribute: string) {
    const { attr, value, modifier } = parseAttribute(attribute);
    if (value) {
        if (modifier === '^') {
            return { attr, value: `${value}*` };
        } else if (modifier === '|') {
            return { attr, value: `*-${value}-*` };
        } else if (modifier === '~') {
            return { attr, value: `* ${value} *` };
        } else if (modifier === '*') {
            return { attr, value: `*${value}*` };
        } else if (modifier === '$') {
            return { attr, value: `*${value}` };
        } else {
            return { attr, value: value };
        }
    }
    return { attr, value: '' };
}

function parseAttribute(attribute: string) {
    let [attr, value] = attribute.split('=');
    if (value) {
        if (value.endsWith(' i')) {
            value = value
                .slice(0, -2)
                .replaceAll('"', '')
                .split('')
                .map((char, i) => (i % 2 !== 0 ? char.toLowerCase() : char.toUpperCase()))
                .join('');
        }
        value = value[0] === '"' ? value.slice(1, -1) : value;
        const modifier = ['^', '$', '~', '*', '|'].includes(attr.at(-1)!) ? attr.at(-1) : '';
        attr = modifier ? attr.slice(0, -1) : attr;
        return { attr, value, modifier };
    }
    return { attr, value };
}
