import { parseCssSelector, groupCompoundSelectors, CompoundSelector } from '@tokey/css-selector-parser';
import { pseudoClassDescriptor, PSEUDO_CLASS_STATE } from './helpers/pseudo-classes';
import { ERROR, EXIST, FULL, parseAttribute } from './helpers/parse-attribute';
import { PseudoClass, PseudoClassName } from './types';

const ERRORS = {
    TWO_IDS: 'An element cannot have two ids',
};

const capitalizeFirstLetter = (str: string) => (str?.length ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const addSingleQuotes = (items: string[]) => items.map((item) => `'${item}'`);
const getClassesString = (cls: string[]) => (cls.length > 1 ? `classes ${joiner(cls)}` : `a class of ${cls[0]}`);
const getPseudoClassesString = (pseudoClasses: PseudoClass[]) => {
    const stateName = pseudoClasses.map((pClass) => {
        if (pClass.value) {
            return pseudoClassDescriptor(pClass);
        }
        return PSEUDO_CLASS_STATE[pClass.name];
    });

    if (stateName.length > 1) {
        return joiner(stateName);
    }
    return stateName[0];
};

export function translate(selector: string) {
    const errors: string[] = [];
    const selectorList = parseCssSelector(selector);
    const compoundSelectorList = groupCompoundSelectors(selectorList);
    const translations: string[] = [];
    for (const topLevelSelectors of compoundSelectorList) {
        const translation: string[] = [];
        for (const selector of topLevelSelectors.nodes.reverse()) {
            if (selector.type === 'compound_selector') {
                const { classes, hasUniversal, element, id, attributes, pseudoClasses } =
                    iterateCompoundSelector(selector);
                if (id.length > 1) {
                    errors.push(ERRORS.TWO_IDS);
                }
                if (element) {
                    isVowelPrefix(element) ? translation.push('an') : translation.push('a');
                    translation.push(`'<${element}>' element`);
                } else if (hasUniversal) {
                    translation.push('any element');
                } else {
                    translation.push('an element');
                }
                if (id.length) {
                    translation.push(`with the id of '${id}'`);
                }

                if (classes.length) {
                    translation.push(`with ${getClassesString(addSingleQuotes(classes))}`);
                }

                if (pseudoClasses.length) {
                    translation.push(`when its ${getPseudoClassesString(pseudoClasses)}`);
                }

                if (attributes.length) {
                    for (const attribute of attributes) {
                        const { type } = attribute;
                        if (type === ERROR) {
                            errors.push(attribute.error);
                        } else if (type === EXIST) {
                            translation.push(`with an attribute of '${attribute.name}'`);
                        } else if (type === FULL) {
                            const { value, descriptor, name, casing } = attribute;
                            translation.push(
                                `with an attribute of '${name}' ${descriptor(value)}${
                                    casing ? ' (case insensitive)' : ''
                                }`
                            );
                        }
                    }
                }
            }

            if (selector.type === 'combinator') {
                translation.push('within');
            }
        }
        translations.push(translation.join(' '));
    }
    return errors.length ? `Error: ${errors[0]}` : capitalizeFirstLetter(joiner(translations));
}

function iterateCompoundSelector(compoundSelector: CompoundSelector) {
    const classes = new Set<string>();
    const id: string[] = [];
    const attributes = [];
    const pseudoClasses: PseudoClass[] = [];
    let hasUniversal = false;
    let element: string | undefined;
    for (const node of compoundSelector.nodes) {
        if (node.type === 'class') {
            classes.add(node.value);
        }

        if (node.type === 'type') {
            element = node.value;
        }

        if (node.type === 'id') {
            id.push(node.value);
        }

        if (node.type === 'attribute') {
            attributes.push(parseAttribute(node.value));
        }

        if (node.type === 'universal') {
            hasUniversal = true;
        }

        if (node.type === 'pseudo_class') {
            // TODO: handle nth child formulas
            if (node.nodes?.[0].nodes[0].type == 'type') {
                pseudoClasses.push({ name: node.value as PseudoClassName, value: node.nodes?.[0].nodes[0].value });
                continue;
            }
            pseudoClasses.push({ name: node.value as PseudoClassName });
        }
    }
    return { classes: Array.from(classes), hasUniversal, element, id, attributes, pseudoClasses };
}

function joiner(items: string[]) {
    if (items.length === 2) {
        return `${items[0]} and ${items[1]}`;
    }
    if (items.length > 2) {
        return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
    }

    return items[0];
}

function isVowelPrefix(str: string) {
    if (['ul'].includes(str)) {
        return false;
    }
    return ['li'].includes(str) || ['a', 'e', 'o', 'i', 'u'].includes(str[0]);
}
