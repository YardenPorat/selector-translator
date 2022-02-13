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
const hasEndingTag = (el: HTMLElement) => {
    const tagName = el.tagName.toLowerCase();
    return el.outerHTML.slice(-1 * (tagName.length + 3)).includes(`/${tagName}`);
};
function getInnerHtml(el: HTMLElement, innerText = '') {
    const index = el.outerHTML.indexOf('>');
    const gotEndingTag = hasEndingTag(el);
    // console.log('gotEndingTag', gotEndingTag);
    // console.log('el', el);
    // console.log('el.outerHTML', el.outerHTML);
    const startingTag = el.outerHTML.slice(0, index + 1);
    const ending = gotEndingTag ? el.outerHTML.slice(-1 * (el.tagName.length + 3)) : el.outerHTML.slice(-1);
    const outerHtml = `${startingTag}${innerText && gotEndingTag ? innerText + ending : ''}`;
    return escapeChars(outerHtml);
}

/** This values will be presented to the user */
function addVisibleAttributes(element: VisualizationElement, el: HTMLElement) {
    if (element.attributes) {
        for (const [key, value] of Object.entries(element.attributes)) {
            el.setAttribute(key, value);
        }
    }
}

function addHiddenAttributes(element: VisualizationElement, el: HTMLElement, innerHTML: string) {
    const { tag, innerText } = element;
    if (tag === 'input') {
        const escaped = unescapeChars(innerHTML);
        // move inner text to value
        const escapedWithInnerText = innerText ? `${escaped.slice(0, -1)} value="${innerText}">` : escaped;
        const inputLength = escapedWithInnerText.length + (innerText ? -3 : 0);
        el.innerText = '';
        el.setAttribute('value', escapedWithInnerText);
        el.setAttribute('type', 'text');
        el.setAttribute('size', `${inputLength}`);
    }

    if (tag === 'textarea') {
        el.setAttribute('cols', `${innerHTML.length}`);
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
