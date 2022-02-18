export interface VisualizationElement {
    tag: string;
    classes?: string[];
    id?: string;
    children?: VisualizationElement[];
    innerText?: string;
    attributes?: { [key: string]: string };
}

export function createVisualizationElement(element: VisualizationElement) {
    const el = document.createElement(element.tag);

    if (element.classes) el.classList.add(...element.classes);
    if (element.id) el.id = element.id;
    addVisibleAttributes(element, el);
    const innerHTML = getInnerHtml(el, element.innerText);
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
const hasEndingTag = (el: HTMLElement) =>
    el.outerHTML.slice(-(el.tagName.length + 3)).includes(`/${el.tagName.toLowerCase()}`);

function getInnerHtml(el: HTMLElement, innerText = '') {
    const gotEndingTag = hasEndingTag(el);
    const startingTag = getStartingTag(el);
    const ending = gotEndingTag ? el.outerHTML.slice(-1 * (el.tagName.length + 3)) : el.outerHTML.slice(-1);
    const outerHtml = `${startingTag}${innerText && gotEndingTag ? innerText + ending : ''}`;
    return escapeChars(outerHtml);
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
    if (tag === 'input') {
        // move inner text to value
        const escapedWithInnerText = innerText ? `${unescaped.slice(0, -1)} value="${innerText}">` : unescaped;
        el.innerText = '';
        el.setAttribute('type', 'text');

        el.setAttribute('value', escapedWithInnerText);
        el.setAttribute('size', `${calculateLength(escapedWithInnerText)}`);
    }

    if (tag === 'textarea') {
        el.setAttribute('cols', `${calculateLength(unescaped)}`);
        el.setAttribute('spellcheck', 'false');
    }
}

export function getVisualizationStyle(rootSelector: string, inputSelector: string) {
    return `${rootSelector} ${inputSelector} { 
        background-color: var(--primary);
        box-shadow: rgb(0 0 0 / 35%) 0px -50px 36px -28px inset;
        color: black;
    }
    ${rootSelector} ${inputSelector} * { 
        background-color: rgb(0 0 0 / 50%);
        color: white;
    }
    ${rootSelector} :not(${inputSelector}){
        color: white;
    }
    `.trim();
}
