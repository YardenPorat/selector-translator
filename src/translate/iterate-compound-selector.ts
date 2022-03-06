import {
    stringifySelectorAst,
    type CompoundSelector,
    type NthDash,
    type NthNode,
    type NthOf,
    type NthOffset,
    type NthStep,
} from '@tokey/css-selector-parser';
import { translate } from './translate';
import { parsePseudoClassNode } from './helpers/pseudo-classes';
import { parseAttribute, ERROR } from './helpers/parse-attribute';
import { isPseudoElement, type PseudoElement } from './helpers/pseudo-elements';
import { ERRORS, pseudoClassWithNodes } from './constants';

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
            const { value, nodes } = node;

            if (!value) {
                result.err = ERRORS.EMPTY_PSEUDO_CLASS;
                break;
            } else if (pseudoClassWithNodes.has(value) && !nodes) {
                result.err = ERRORS.EXPECTED_PSEUDO_CLASS_NODE;
                break;
            } else if (pseudoClassWithNodes.has(value) && nodes?.length === 0) {
                result.err = ERRORS.EMPTY_REQUIRED_NODE;
                break;
            } else if (isPseudoElement(value)) {
                result.err = ERRORS.PSEUDO_ELEMENT_AS_PSEUDO_CLASS(value);
                break;
            } else if (value === 'not') {
                const innerNodes = nodes![0].nodes;
                if (innerNodes.length === 1 && innerNodes[0].type === 'universal') {
                    result.err = ERRORS.ABUSED_NOT_PSEUDO_CLASS;
                    break;
                }
                if (innerNodes.some((node) => node.type === 'pseudo_class' && node.value === 'not')) {
                    result.err = ERRORS.NESTED_NOT_PSEUDO_CLASS;
                    break;
                }
                const innerSelector = stringifySelectorAst(nodes!); // validated that nodes is not empty
                const { translation } = translate(innerSelector, { not: true });
                result.pseudoClasses.push({ name: value, value: translation.toLowerCase() });
            } else if (nodes?.length && (nodes[0].nodes as NthNode[])) {
                const innerNodes = nodes[0].nodes as (NthStep | NthOffset | NthDash | NthOf)[];

                if (innerNodes.some((node) => node.invalid === true)) {
                    result.err = ERRORS.INCORRECT_PSEUDO_CLASS_NODE(stringifySelectorAst(nodes));
                    break;
                }

                /** after invalid check, because (3 2n) is identified as nth_of */
                if (innerNodes.some((node) => node.type === 'nth_of')) {
                    result.err = ERRORS.NTH_OF_NOT_SUPPORTED;
                    break;
                }

                /** Check for lacking sign after spaces */
                if (
                    innerNodes[0].after?.includes(' ') &&
                    !innerNodes[1].value.startsWith('+') &&
                    !innerNodes[1].value.startsWith('-')
                ) {
                    result.err = ERRORS.INCORRECT_PSEUDO_CLASS_NODE(stringifySelectorAst(nodes));
                    break;
                }
                const { parsedPseudoClass } = parsePseudoClassNode(value, innerNodes);
                result.pseudoClasses.push(parsedPseudoClass);
            } else {
                result.pseudoClasses.push({ name: node.value as PseudoClassName });
            }
        }
    }
    return result;
}
