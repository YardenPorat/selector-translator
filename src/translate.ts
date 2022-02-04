import { parseCssSelector, groupCompoundSelectors, CompoundSelector } from '@tokey/css-selector-parser';
import { Attribute, ERROR, EXIST, FULL, parseAttribute } from './helpers/parse-attribute';
import { PseudoClass, PseudoClassName } from './types';
import { PseudoElement, PSEUDO_ELEMENTS_DESCRIPTORS } from './helpers/pseudo-elements';
import { getPseudoClassesString } from './helpers/pseudo-classes';
import { joiner } from './helpers/joiner';

const ERRORS = {
    TWO_IDS: 'An element cannot have two ids',
    EMPTY_CLASS: 'You specified an empty class',
    EMPTY_PSEUDO_CLASS: 'You specified an empty pseudo class',
    PSEUDO_ELEMENT_AS_PSEUDO_CLASS: (el: string) => `You specified a pseudo element (${el}) as a pseudo class`,
};

const capitalizeFirstLetter = (str: string) => (str?.length ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const addSingleQuotes = (items: string[]) => items.map((item) => `'${item}'`);
const getClassesString = (cls: string[]) => (cls.length > 1 ? `classes ${joiner(cls)}` : `a class of ${cls[0]}`);

export function translate(selector: string) {
    const errors: string[] = [];
    const selectorList = parseCssSelector(selector);
    const compoundSelectorList = groupCompoundSelectors(selectorList);
    const translations: string[] = [];
    for (const topLevelSelectors of compoundSelectorList) {
        const translation: string[] = [];
        for (const selector of topLevelSelectors.nodes.reverse()) {
            if (errors.length) break;
            if (selector.type === 'compound_selector') {
                const { classes, hasUniversal, element, id, attributes, pseudoClasses, pseudoElement, err } =
                    iterateCompoundSelector(selector);
                if (err) errors.push(err);
                if (pseudoElement) {
                    translation.push(PSEUDO_ELEMENTS_DESCRIPTORS[pseudoElement]);
                }
                if (element) {
                    isVowelPrefix(element) ? translation.push('an') : translation.push('a');
                    translation.push(`'<${element}>' element`);
                } else if (
                    hasUniversal ||
                    (!element && topLevelSelectors.nodes.length === 1 && id.length + classes.size === 0)
                ) {
                    translation.push('any element');
                } else if (!pseudoElement) {
                    translation.push('an element');
                }
                if (id.length) {
                    translation.push(`with the id of '${id}'`);
                }

                if (classes.size) {
                    translation.push(`with ${getClassesString(addSingleQuotes([...classes]))}`);
                }

                if (pseudoClasses.length) {
                    translation.push(`when its ${getPseudoClassesString(pseudoClasses)}`);
                }

                if (attributes.length) {
                    for (const attribute of attributes) {
                        const { type } = attribute;
                        if (type === EXIST) {
                            translation.push(`with an attribute of '${attribute.name}'`);
                        } else if (type === FULL) {
                            const { value, descriptor, name, casing } = attribute;
                            translation.push(`with an attribute of '${name}'`);
                            if (descriptor) translation.push(descriptor(value!));
                            if (casing) translation.push('(case insensitive)');
                        }
                    }
                }
            }

            if (selector.type === 'combinator') {
                if (selector.value === '>') translation.push('directly within');
                else if (selector.value === '+') translation.push('directly adjacent to');
                else if (selector.value === '~') translation.push('after a sibling which is');
                else translation.push('within');
            }
        }
        translations.push(translation.join(' '));
    }
    return errors.length ? `Error: ${errors[0]}` : capitalizeFirstLetter(joiner(translations));
}

function iterateCompoundSelector(compoundSelector: CompoundSelector) {
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
            result.pseudoElement = node.value as PseudoElement;
        } else if (node.type === 'class') {
            if (node.value === '') {
                result.err = ERRORS.EMPTY_CLASS;
                break;
            }
            result.classes.add(node.value);
        } else if (node.type === 'type') {
            result.element = node.value;
        } else if (node.type === 'id') {
            if (result.id) {
                result.err = ERRORS.TWO_IDS;
                break;
            }
            result.id = node.value;
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
            if (!node.value) {
                result.err = ERRORS.EMPTY_PSEUDO_CLASS;
                break;
            }
            if (Object.keys(PSEUDO_ELEMENTS_DESCRIPTORS).includes(node.value)) {
                result.err = ERRORS.PSEUDO_ELEMENT_AS_PSEUDO_CLASS(node.value);
                break;
            }

            // TODO: handle nth child formulas
            if (node.nodes?.[0].nodes[0].type == 'type') {
                result.pseudoClasses.push({
                    name: node.value as PseudoClassName,
                    value: node.nodes?.[0].nodes[0].value,
                });
                continue;
            }
            result.pseudoClasses.push({ name: node.value as PseudoClassName, value: '' });
        }
    }
    return result;
}

function isVowelPrefix(str: string) {
    if (['ul'].includes(str)) {
        return false;
    }
    return ['li'].includes(str) || ['a', 'e', 'o', 'i', 'u'].includes(str[0]);
}
