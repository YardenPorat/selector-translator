import { parseCssSelector, groupCompoundSelectors, calcSpecificity } from '@tokey/css-selector-parser';
import { EXIST, FULL } from './helpers/parse-attribute';
import { PSEUDO_ELEMENTS_DESCRIPTORS } from './helpers/pseudo-elements';
import { getPseudoClassesString } from './helpers/pseudo-classes';
import { joiner } from './helpers/string-manipulation';
import { iterateCompoundSelector } from './iterate-compound-selector';
import { ERRORS } from './constants';
import { getVowelPrefix } from './helpers/english';

const capitalizeFirstLetter = (str: string) => (str?.length ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const addSingleQuotes = (items: string[]) => items.map((item) => `'${item}'`);
const getClassesString = (cls: string[]) => (cls.length > 1 ? `classes ${joiner(cls)}` : `a class of ${cls[0]}`);

export interface TranslateOptions {
    not?: boolean;
    where?: boolean;
}
export function translate(selector: string, options: TranslateOptions = { not: false, where: false }) {
    const errors: string[] = [];
    const selectorList = parseCssSelector(selector);
    const specificity = selectorList.map((selector) => calcSpecificity(selector));
    const compoundSelectorList = groupCompoundSelectors(selectorList);
    const translations: string[] = [];
    let pseudoElementCount = 0;

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
                    pseudoElementCount++;
                    if (pseudoElementCount > 1) {
                        errors.push(ERRORS.MULTIPLE_PSEUDO_ELEMENT);
                    }
                    translation.push(PSEUDO_ELEMENTS_DESCRIPTORS[pseudoElement]);
                }
                if (element) {
                    translation.push(getVowelPrefix(element));
                    translation.push(`'<${element}>' element`);
                } else if (
                    !options.where &&
                    (hasUniversal ||
                        (!element && topLevelSelectors.nodes.length === 1 && id.length + classes.size === 0))
                ) {
                    translation.push('any element');
                } else if (!options.where && !pseudoElement) {
                    translation.push('an element');
                }
                if (id.length) {
                    translation.push(`with the id of '${id}'`);
                }

                if (classes.size) {
                    translation.push(`with ${getClassesString(addSingleQuotes([...classes]))}`);
                }

                if (pseudoClasses.length) {
                    const pseudoClassString = getPseudoClassesString(pseudoClasses);
                    const prefix = !options.where && !pseudoClassString.startsWith('with a') ? 'when its ' : '';
                    translation.push(prefix + pseudoClassString);
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
    const translation = capitalizeFirstLetter(joiner(translations, options));
    return errors.length ? { translation: `Error: ${errors[0]}` } : { translation, specificity };
}
