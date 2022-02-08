import { parseCssSelector, groupCompoundSelectors } from '@tokey/css-selector-parser';
import { EXIST, FULL } from './helpers/parse-attribute';
import { PSEUDO_ELEMENTS_DESCRIPTORS } from './helpers/pseudo-elements';
import { getPseudoClassesString } from './helpers/pseudo-classes';
import { joiner } from './helpers/string-manipulation';
import { iterateCompoundSelector } from './iterate-compound-selector';

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
            if (selector.type === 'compound_selector') {
                const { classes, hasUniversal, element, id, attributes, pseudoClasses, pseudoElement, err } =
                    iterateCompoundSelector(selector);
                if (err) {
                    errors.push(err);
                    break;
                }
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
                if (['>', '+', '~'].includes(selector.value) && !translation.length) {
                    errors.push(`You Specified an empty combinator '${selector.value}'`);
                    break;
                }
                if (selector.value === '>') translation.push('directly within');
                else if (selector.value === '+') translation.push('directly adjacent sibling to');
                else if (selector.value === '~') translation.push('after a sibling which is');
                else translation.push('within');
            }
        }
        translations.push(translation.join(' '));
    }
    return errors.length ? `Error: ${errors[0]}` : capitalizeFirstLetter(joiner(translations));
}

function isVowelPrefix(str: string) {
    if (['ul'].includes(str)) {
        return false;
    }
    return ['li'].includes(str) || ['a', 'e', 'o', 'i', 'u'].includes(str[0]);
}
