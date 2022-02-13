import { parseCssSelector, PseudoClass } from '@tokey/css-selector-parser';
import {
    parsePseudoClassNode,
    parseStep,
    PSEUDO_CLASS_ATTRIBUTES,
    PSEUDO_CLASS_STATE,
} from './translate/helpers/pseudo-classes';
import type { VisualizationElement } from './ui/visualization/create-element';
import type { PseudoClassName } from './translate/types';

function appendAttribute(attribute: string, tag: string | undefined) {
    let [attr, value] = attribute.split('=');
    if (value) {
        value = value.endsWith(' i') ? value.slice(0, -2) : value;
        value = value[0] === '"' ? value.slice(1, -1) : value;
        const modifier = ['^', '$', '~', '*', '|'].includes(attr.at(-1)!) ? attr.at(-1) : '';
        attr = modifier ? attr.slice(0, -1) : attr;
        if (modifier === '^') {
            attribute = `${attr}="${value}*"`;
        } else if (modifier === '|') {
            attribute = attr + '="*-' + value + '-*"';
        } else if (modifier === '~') {
            attribute = `${attr}="* ${value} *"`;
        } else if (modifier === '*') {
            attribute = `${attr}="*${value}*"`;
        } else if (modifier === '$') {
            attribute = `${attr}="*${value}"`;
        } else if (!modifier) {
            attribute = `${attr}="${value}"`;
        }
    }
    if (!tag) {
        return `<element ${attribute}>`;
    }
    return `${tag.slice(0, -1)} ${attribute}>`;
}

const getLastIndex = (arr: any[]) => arr.length - 1;

let currentElement: VisualizationElement;
let siblingArrayRef: VisualizationElement[];
const baseElement: VisualizationElement = { tag: 'div' };

export function visualize(selector: string) {
    const [selectorList] = parseCssSelector(selector); // first selector, before the ','

    const tags = [''];
    const elements: VisualizationElement[] = [{ ...baseElement }];
    siblingArrayRef = elements;
    currentElement = elements[0];
    let duplicateNext = false;
    let duplicateAsSibling = false;
    let adjacentCount = selector.split('+').length - 1;

    for (const selector of selectorList.nodes) {
        if (selector.type === 'type') {
            // Tag
            Object.assign(currentElement, { tag: selector.value });
        } else if (selector.type === 'class') {
            currentElement.classes = [...new Set([...(currentElement.classes ?? []), selector.value])];
        } else if (selector.type === 'id') {
            Object.assign(currentElement, { id: selector.value });
        } else if (selector.type === 'attribute') {
            tags[tags.length - 1] = appendAttribute(selector.value, tags.at(-1));
        } else if (selector.type === 'pseudo_class') {
            const value = selector.value as PseudoClassName;

            let mainText = '';
            if (hasInnerNodes(selector)) {
                const { parsedPseudoClass } = parsePseudoClassNode(selector.value, selector.nodes![0].nodes);
                if (parsedPseudoClass.name === 'lang') {
                    mainText = `${PSEUDO_CLASS_STATE[parsedPseudoClass.name].state} is '${parsedPseudoClass.value!}'`;
                    addAttributes([[parsedPseudoClass.name, parsedPseudoClass.value!]]);
                } else if (parsedPseudoClass.offset && !parsedPseudoClass.step) {
                    const offset = Number(parsedPseudoClass.offset);
                    appendMultipleSiblings(offset);
                    moveRefToSiblingByIndex(offset - 1); // 1 based
                } else if (parsedPseudoClass.offset && parsedPseudoClass.step) {
                    const offset = Number(parsedPseudoClass.offset);
                    appendMultipleSiblings(offset * 2);
                    moveRefToSiblingByIndex(offset - 1); // 1 based
                } else if (!parsedPseudoClass.offset && parsedPseudoClass.step) {
                    const step = Math.abs(parseStep(parsedPseudoClass.step));
                    appendMultipleSiblings(step * 2);
                    moveRefToSiblingByIndex(step - 1); // 1 based
                }
            } else if (['disabled', 'required', 'read-only'].includes(value)) {
                const attrName = getAttributeName(value);
                addAttributes([[attrName, 'true']]);
                mainText = value;
            } else if (value === 'invalid') {
                addAttributes([['type', 'email']]);
                mainText = value;
            } else if (value === 'in-range' || value === 'out-of-range') {
                addAttributes([
                    ['min', '5'],
                    ['max', '10'],
                ]);
                mainText = value;
            } else {
                mainText = PSEUDO_CLASS_STATE[value].state;
            }

            const extraText = PSEUDO_CLASS_STATE[value].text ? ` (${PSEUDO_CLASS_STATE[value].text})` : '';

            if (mainText) {
                appendInnerText(mainText, extraText, currentElement);
            }

            if (value === 'last-child' || value === 'last-of-type') {
                duplicateElementAsSibling(currentElement, { moveRef: true });
            }
            if (value === 'first-child' || value === 'first-of-type') {
                duplicateElementAsSibling(currentElement, { moveRef: false });
            }
        } else if (selector.type === 'combinator') {
            const [combinator] = selector.value;

            if (combinator === ' ') {
                // Child combinators
                addChild(currentElement, baseElement, { moveSiblingsRef: true, moveRefToChild: true });
            } else if (combinator === '>') {
                addChild(currentElement, baseElement, { moveSiblingsRef: true, moveRefToChild: true });
                duplicateNext = true;
                continue;
            } else if (combinator === '+') {
                adjacentCount--;
                siblingArrayRef.push({ ...baseElement });
                moveRefToSiblingByIndex(-1);
                if (adjacentCount === 0) {
                    // Only last element of adjacent combinator will be duplicated
                    duplicateAsSibling = true;
                }
            } else if (combinator === '~') {
                addSibling(currentElement, baseElement, { moveRef: true });
            }
        } else if (selector.type === 'universal') {
            if (tags.at(-1) === '') {
                tags[tags.length - 1] = 'Any element';
            } else {
                tags.push('Any element');
            }
        }

        if (duplicateNext) {
            addChild(currentElement, currentElement);
            duplicateNext = false;
        }

        if (duplicateAsSibling) {
            siblingArrayRef.push(currentElement);
            duplicateAsSibling = false;
        }
    }

    return elements;
}
function hasInnerNodes(selector: PseudoClass) {
    return selector.nodes && selector.nodes[0].nodes;
}

function appendMultipleSiblings(amount: number) {
    for (let index = 0; index < amount; index++) {
        duplicateElementAsSibling(currentElement, { moveRef: false });
    }
}
interface DuplicateElementAsSiblingOptions {
    moveRef?: boolean;
}
function duplicateElementAsSibling(element: VisualizationElement, options: DuplicateElementAsSiblingOptions = {}) {
    const newSibling = { ...element };
    siblingArrayRef.push(newSibling);
    if (options.moveRef) {
        currentElement = newSibling;
    }
}

interface AddChildOptions {
    moveSiblingsRef?: boolean;
    moveRefToChild?: boolean;
}
function addChild(parent: VisualizationElement, child = baseElement, options: AddChildOptions = {}) {
    const newChild = { ...child };

    if (!parent.children) {
        parent.children = [];
    }
    parent.children.push({ ...newChild });

    if (options.moveSiblingsRef) {
        siblingArrayRef = parent.children;
    }

    if (options.moveRefToChild) {
        currentElement = parent.children.at(-1)!;
    }
}

interface AddSiblingOptions {
    moveRef?: boolean;
}
function addSibling(element: VisualizationElement, sibling = baseElement, options: AddSiblingOptions = {}) {
    const lastIndex = getLastIndex(siblingArrayRef);
    siblingArrayRef.push({ ...sibling });

    if (options.moveRef) {
        currentElement = siblingArrayRef.at(lastIndex + 1)!;
    }
}

function moveRefToSiblingByIndex(index: number) {
    if (index === -1) {
        currentElement = siblingArrayRef[getLastIndex(siblingArrayRef)];
        return;
    }
    currentElement = siblingArrayRef[index];
}

function addAttributes(keyValues: [string, string][]) {
    if (!currentElement.attributes) {
        currentElement.attributes = {};
    }

    for (const [key, value] of keyValues) {
        currentElement.attributes[key] = value;
    }
}

function getAttributeName(value: string) {
    if (Object.keys(PSEUDO_CLASS_ATTRIBUTES).includes(value)) {
        return PSEUDO_CLASS_ATTRIBUTES[value as keyof typeof PSEUDO_CLASS_ATTRIBUTES];
    }
    return value;
}

function appendInnerText(mainText: string, secondaryText: string, currentElement: VisualizationElement) {
    const text = `${mainText}${secondaryText}`;
    if (currentElement.innerText) {
        currentElement.innerText += ` and ${text}`;
    } else {
        currentElement.innerText = `When its ${text}`;
    }
}
