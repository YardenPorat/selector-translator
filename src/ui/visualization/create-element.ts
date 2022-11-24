import { INPUT } from '../../consts';

export interface VisualizationElement {
    tag?: string;
    classes?: string[];
    id?: string;
    children?: VisualizationElement[];
    innerText?: string;
    attributes?: { [key: string]: string };
    hideTag?: boolean;
}

export function createVisualizationElement(element: VisualizationElement) {
    const el = document.createElement(element.tag ?? 'div');

    if (element.classes) el.classList.add(...element.classes);
    if (element.id) el.id = element.id;
    addVisibleAttributes(element, el);
    const innerHTML = getInnerHtml(el, element);
    el.innerHTML = innerHTML;
    addHiddenAttributes(element, el, innerHTML);
    addVisibleAttributes(element, el); // visible attributes should override hidden ones

    if (element.children) {
        el.append(...element.children.map((child) => createVisualizationElement(child)));
    }
    return el;
}

const escapeChars = (str: string) => str.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const unescapeChars = (str: string) => str.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const getStartingTag = (el: HTMLElement) => el.outerHTML.slice(0, el.outerHTML.indexOf('>') + 1);
const hasEndingTag = (el: HTMLElement) => {
    const outerHTML = el.outerHTML.slice(-(el.tagName.length + 3));
    return outerHTML.includes(`/${el.tagName.toLowerCase()}`);
};

function getInnerHtml(el: HTMLElement, element: VisualizationElement) {
    const { innerText, hideTag } = element;
    if (!hideTag) {
        const outerHtml = [];
        const startingTag = getStartingTag(el);
        outerHtml.push(startingTag);
        const gotEndingTag = hasEndingTag(el);
        const ending = gotEndingTag ? el.outerHTML.slice(-1 * (el.tagName.length + 3)) : el.outerHTML.slice(-1);

        if (innerText && element.tag !== INPUT) {
            outerHtml.push(`${innerText}${ending}`);
        }

        return escapeChars(outerHtml.join(''));
    }
    return escapeChars(innerText ?? '');
}

/** This attributes will be presented to the user */
function addVisibleAttributes(element: VisualizationElement, el: HTMLElement) {
    if (element.attributes) {
        for (const [key, value] of Object.entries(element.attributes)) {
            el.setAttribute(key, value);
        }
    }
}

//shortest: input:out-of-range
const countShortChars = (str: string) => (str.match(/(i|l|"|t|r|f)/g) ?? []).length;
const calculateLength = (str: string) => str.length - Math.ceil(countShortChars(str) / 3);

/** This attributes will be hidden from the user */
function addHiddenAttributes(element: VisualizationElement, el: HTMLElement, innerHTML: string) {
    const { tag, innerText } = element;
    const unescaped = unescapeChars(innerHTML);
    if (tag === INPUT) {
        // move inner text to value
        const escapedWithInnerText = innerText ? `${unescaped.slice(0, -1)} value="${innerText}">` : unescaped;
        el.innerText = '';
        el.setAttribute('type', 'text');
        el.setAttribute('spellcheck', 'false');
        el.setAttribute('value', escapedWithInnerText);
        el.setAttribute('size', `${calculateLength(escapedWithInnerText)}`);
    }

    if (tag === 'textarea') {
        el.setAttribute('cols', `${calculateLength(unescaped)}`);
        el.setAttribute('spellcheck', 'false');
    }

    if ((tag === 'area' || tag === 'a') && element.attributes?.href) {
        el.setAttribute('target', '_blank');
    }
}

const replacements = {
    '::first-line': ' [data="first-child"]',
    '::first-letter': ' [data="first-letter"]::first-letter',
};
type replacer = keyof typeof replacements;
const findSelectorToReplace = (selector: string) => {
    for (const toReplace of Object.keys(replacements) as replacer[]) {
        if (selector.includes(toReplace)) {
            return toReplace;
        }
    }
};

export function getVisualizationStyle(rootSelector: string, inputSelector: string) {
    const toBeReplaced = findSelectorToReplace(inputSelector);
    const selector = toBeReplaced ? inputSelector.replace(toBeReplaced, replacements[toBeReplaced]) : inputSelector;
    const after = inputSelector.includes('::after') ? 'after pseudo element' : '';
    const before = inputSelector.includes('::before') ? 'before pseudo element' : '';

    return `${rootSelector} ${selector} { 
        background-color: var(--primary);
        box-shadow: rgb(0 0 0 / 35%) 0px -50px 36px -28px inset;
        color: black;
        padding-top: 2px;
        padding-right: 2px;
        text-shadow: none;
        ${before || after ? `content: '${after}${before}';` : ''}
    }
    ${rootSelector} ${selector} * { 
        background-color: black;
        color: white;
    }
    ${rootSelector} :not(${selector}){
        color: white;
        background-color: transparent;
    }
    `.trim();
}
