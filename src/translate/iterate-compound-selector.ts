import { parsePseudoClassNode } from './helpers/pseudo-classes';
import { parseAttribute, ERROR } from './helpers/parse-attribute';
import { isPseudoElement, type PseudoElement } from './helpers/pseudo-elements';
import { ERRORS, pseudoClassWithNodes } from './constants';
import type { CompoundSelector, NthNode, NthOf } from '@tokey/css-selector-parser';
import type { PseudoClass, Attribute, PseudoClassName } from './types';

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
            } else if (pseudoClassWithNodes.has(value) && !node.nodes) {
                result.err = ERRORS.EXPECTED_PSEUDO_CLASS_NODE;
                break;
            } else if (pseudoClassWithNodes.has(value) && node.nodes?.length === 0) {
                result.err = ERRORS.EMPTY_REQUIRED_NODE;
                break;
            } else if (isPseudoElement(value)) {
                result.err = ERRORS.PSEUDO_ELEMENT_AS_PSEUDO_CLASS(value);
                break;
            } else if (node.nodes?.length && (node.nodes[0].nodes as NthNode[])) {
                if (node.nodes[0].nodes.some((node) => (node as NthOf).invalid === true)) {
                    result.err = ERRORS.INCORRECT_PSEUDO_CLASS_NODE((node.nodes[0].nodes[0] as NthOf).value);
                    break;
                }
                const { parsedPseudoClass } = parsePseudoClassNode(node.value, node.nodes[0].nodes);
                result.pseudoClasses.push(parsedPseudoClass);
            } else {
                result.pseudoClasses.push({ name: node.value as PseudoClassName });
            }
        }
    }
    return result;
}
