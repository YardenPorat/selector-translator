import { parseCssSelector, groupCompoundSelectors, CompoundSelector } from '@tokey/css-selector-parser';

const ERRORS = {
    TWO_IDS: 'An element cannot have two ids',
};
const COMPOUND_SELECTOR = 'compound_selector';
const CLASS = 'class';
const UNIVERSAL = 'universal';
const TYPE = 'type';

const capitalizeFirstLetter = (str: string) => (str?.length ? str.charAt(0).toUpperCase() + str.slice(1) : str);
const addSingleQuotes = (items: string[]) => items.map((item) => `'${item}'`);
const isVowelPrefix = (str: string) => ['a', 'e', 'o', 'i', 'u'].includes(str[0]);
const getClassesString = (cls: string[]) => (cls.length > 1 ? `classes ${joiner(cls)}` : `a class of ${cls[0]}`);

export function translate(selector: string) {
    const errors: string[] = [];
    const selectorList = parseCssSelector(selector);
    const compoundSelectorList = groupCompoundSelectors(selectorList);
    const translations: string[] = [];
    for (const topLevelSelectors of compoundSelectorList) {
        const translation: string[] = [];
        for (const selector of topLevelSelectors.nodes.reverse()) {
            if (selector.type === COMPOUND_SELECTOR) {
                const { classes, hasUniversal, element, id } = iterateCompoundSelector(selector);
                if (id.length > 1) {
                    errors.push(ERRORS.TWO_IDS);
                }
                if (element) {
                    isVowelPrefix(element) ? translation.push('An') : translation.push('A');
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
    let id: string[] = [];
    let hasUniversal = false;
    let element: string | undefined;
    for (const node of compoundSelector.nodes) {
        if (node.type === CLASS) {
            classes.add(node.value);
        }
        if (node.type === TYPE) {
            element = node.value;
        }
        if (node.type === 'id') {
            id.push(node.value);
        }
        if (node.type === UNIVERSAL) {
            hasUniversal = true;
        }
    }
    return { classes: Array.from(classes), hasUniversal, element, id };
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
