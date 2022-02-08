const escapeChars = (str: string) => str.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export interface VisualizationElement {
    tag: string;
    classes?: string[];
    id?: string;
    children?: VisualizationElement[];
    innerText?: string;
}
export function createVisualizationElement(element: VisualizationElement) {
    const resolvedTag = element.tag ?? 'div';
    const el = document.createElement(resolvedTag);
    const [startTag, closingBracket, endTag] = [`<${resolvedTag}`, `>`, `</${resolvedTag}`];
    const innerText = element.innerText ? `${closingBracket}${element.innerText}${endTag}` : '';

    const classes = element.classes ? ` class="${element.classes.join(' ')}"` : '';
    const id = element.id ? ` id="${element.id}"` : '';

    const innerHTML = `${startTag}${id}${classes}${innerText}${closingBracket}`;

    el.innerHTML = escapeChars(innerHTML);
    addSpecialAttributes(resolvedTag, el, innerHTML);

    if (element.classes) el.classList.add(...element.classes);
    if (element.id) el.id = element.id;

    if (element.children) {
        el.append(...element.children.map((child) => createVisualizationElement(child)));
    }
    return el;
}

function addSpecialAttributes(resolvedTag: string, el: HTMLElement, innerHTML: string) {
    if (resolvedTag === 'input') {
        el.setAttribute('value', innerHTML);
        el.setAttribute('type', 'text');
        el.setAttribute('size', `${innerHTML.length}`);
    }
    if (resolvedTag === 'textarea') {
        el.setAttribute('cols', `${innerHTML.length}`);
    }
}

export function getVisualizationStyle(rootSelector: string, inputSelector: string) {
    return `${rootSelector} ${inputSelector}:first-line { 
        background-color: var(--primary);
        box-shadow: rgb(0 0 0 / 35%) 0px -50px 36px -28px inset;
        color: black;
    }
    ${rootSelector} :not(${inputSelector}){
        color: white;
    }
    `.trim();
}
