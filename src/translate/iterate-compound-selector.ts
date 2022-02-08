import { isPseudoElement, type PseudoElement } from './helpers/pseudo-elements';
import type { CompoundSelector } from '@tokey/css-selector-parser';
import type { PseudoClass, Attribute, PseudoClassName } from './types';
import { parseAttribute, ERROR } from './helpers/parse-attribute';
import { pseudoClassWithNodes } from './helpers/pseudo-classes';

const ERRORS = {
    TWO_IDS: 'An element cannot have two ids',
    EMPTY_CLASS: 'You specified an empty class',
    EMPTY_ID: 'You specified an empty id',
    EMPTY_PSEUDO_CLASS: 'You specified an empty pseudo class',
    PSEUDO_ELEMENT_AS_PSEUDO_CLASS: (el: string) => `You specified the pseudo element '${el}' as a pseudo class`,
    UNKNOWN_PSEUDO_ELEMENT: (el: string) => `Unknown pseudo element '${el}'`,
    EMPTY_PSEUDO_CLASS_NODE: 'You specified an empty pseudo class node',
    EXPECTED_PSEUDO_CLASS_NODE: `You specified a pseudo class node which is expected to have a node (${[
        ...pseudoClassWithNodes,
    ].join(', ')})`,
};

export function iterateCompoundSelector(compoundSelector: CompoundSelector) {
    const result = {
        attributes: <Attribute[]>[],
        err: '',
        pseudoElement: <PseudoElement>undefined,
        classes: new Set<string>(),
        pseudoClasses: <PseudoClass[]>[],
        element: '',
        id: '',
        hasUniversal: false,
    };
    for (const node of compoundSelector.nodes) {
        if (node.type === 'pseudo_element') {
            if (!isPseudoElement(node.value)) result.err = ERRORS.UNKNOWN_PSEUDO_ELEMENT(node.value);
            else result.pseudoElement = node.value as PseudoElement;
        } else if (node.type === 'class') {
            if (node.value === '') result.err = ERRORS.EMPTY_CLASS;
            else result.classes.add(node.value);
        } else if (node.type === 'type') {
            result.element = node.value;
        } else if (node.type === 'id') {
            if (result.id) result.err = ERRORS.TWO_IDS;
            else if (node.value === '') result.err = ERRORS.EMPTY_ID;
            else result.id = node.value;
        } else if (node.type === 'attribute') {
            const attr = parseAttribute(node.value);
            if (attr.type === ERROR) {
                result.err = attr.error;
                break;
            }
            result.attributes.push(attr);
        } else if (node.type === 'universal') {
            result.hasUniversal = true;
        } else if (node.type === 'pseudo_class') {
            const { value } = node;

            if (!value) {
                result.err = ERRORS.EMPTY_PSEUDO_CLASS;
            } else if (node.nodes && node.nodes.length === 0) {
                result.err = ERRORS.EMPTY_PSEUDO_CLASS_NODE;
                break;
            } else if (pseudoClassWithNodes.has(value) && !node.nodes) {
                result.err = ERRORS.EXPECTED_PSEUDO_CLASS_NODE;
                break;
            } else if (isPseudoElement(value)) {
                result.err = ERRORS.PSEUDO_ELEMENT_AS_PSEUDO_CLASS(value);
            } else if (node.nodes && node.nodes[0].nodes) {
                const secondLevelNodes = node.nodes[0].nodes;
                const types = secondLevelNodes.map((node) => node.type);

                if (secondLevelNodes[0].type === 'type') {
                    /** lang pseudo class */
                    result.pseudoClasses.push({
                        name: node.value as PseudoClassName,
                        value: secondLevelNodes[0].value,
                    });
                } else if (types.includes('nth_offset') || types.includes('nth_step')) {
                    const formula = { offset: '', step: '' };
                    for (const node of secondLevelNodes) {
                        if (node.type === 'nth_offset') {
                            formula.offset = node.value;
                        } else if (node.type === 'nth_step') {
                            formula.step = node.value;
                        }
                    }
                    result.pseudoClasses.push({
                        name: node.value as PseudoClassName,
                        ...formula,
                    });
                }
            } else {
                result.pseudoClasses.push({ name: node.value as PseudoClassName });
            }
        }
    }
    return result;
}
