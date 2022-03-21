import { parseCssSelector, PseudoClass, stringifySelectorAst } from '@tokey/css-selector-parser';
import {
    parsePseudoClassNode,
    parseStep,
    PSEUDO_CLASS_ATTRIBUTES,
    PSEUDO_CLASS_STATE,
} from '../../translate/helpers/pseudo-classes';
import type { VisualizationElement } from './create-element';
import type { PseudoClassName } from '../../translate/types';

function parseAttribute(attribute: string) {
    let [attr, value] = attribute.split('=');
    if (value) {
        if (value.endsWith(' i')) {
            value = value
                .slice(0, -2)
                .replaceAll('"', '')
                .split('')
                .map((char, i) => (i % 2 !== 0 ? char.toLowerCase() : char.toUpperCase()))
                .join('');
        }
        value = value[0] === '"' ? value.slice(1, -1) : value;
        const modifier = ['^', '$', '~', '*', '|'].includes(attr.at(-1)!) ? attr.at(-1) : '';
        attr = modifier ? attr.slice(0, -1) : attr;
        return { attr, value, modifier };
    }
    return { attr, value };
}

function getAttribute(attribute: string) {
    const { attr, value, modifier } = parseAttribute(attribute);
    if (value) {
        if (modifier === '^') {
            return { attr, value: `${value}*` };
        } else if (modifier === '|') {
            return { attr, value: `*-${value}-*` };
        } else if (modifier === '~') {
            return { attr, value: `* ${value} *` };
        } else if (modifier === '*') {
            return { attr, value: `*${value}*` };
        } else if (modifier === '$') {
            return { attr, value: `*${value}` };
        } else {
            return { attr, value: value };
        }
    }
    return { attr, value: '' };
}

const getLastIndex = (arr: any[]) => arr.length - 1;

let currentElement: VisualizationElement;
const baseElement: VisualizationElement = { tag: 'div' };

export function visualize(selector: string) {
    const [selectorList] = parseCssSelector(selector); // first selector, before the ','

    const elements: VisualizationElement[] = [{ ...baseElement }];
    let siblingArrayRef = elements;
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
            const { attr, value } = getAttribute(selector.value);
            addAttributes([[attr, value]]);
        } else if (selector.type === 'pseudo_element') {
            if (selector.value === 'first-line') {
                addChild({
                    parent: currentElement,
                    child: {
                        tag: 'div',
                        innerText: 'First line',
                        attributes: { data: 'first-child' },
                        hideTag: true,
                    },
                });
                addChild({ parent: currentElement, child: { tag: 'div', innerText: 'Second line', hideTag: true } });
                addSiblings({
                    element: currentElement,
                    siblings: [
                        {
                            tag: currentElement.tag,
                            innerText: `</${currentElement.tag}>`,
                            hideTag: true,
                        },
                    ],
                    adjacent: true,
                    siblingArrayRef,
                });
            }
            if (selector.value === 'first-letter') {
                addChild({
                    parent: currentElement,
                    child: {
                        tag: 'div',
                        innerText: 'First letter only',
                        attributes: { data: 'first-letter' },
                        hideTag: true,
                    },
                });
                addSiblings({
                    element: currentElement,
                    siblings: [
                        {
                            tag: currentElement.tag,
                            innerText: `</${currentElement.tag}>`,
                            hideTag: true,
                        },
                    ],
                    siblingArrayRef,
                    adjacent: true,
                });
            }
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
                    duplicateMultipleSiblings(offset, siblingArrayRef);
                    moveRefToSiblingByIndex(offset - 1, siblingArrayRef); // 1 based
                } else if (parsedPseudoClass.offset && parsedPseudoClass.step) {
                    const offset = Math.abs(Number(parsedPseudoClass.offset));
                    duplicateMultipleSiblings(offset * 2, siblingArrayRef);
                    moveRefToSiblingByIndex(offset - 1, siblingArrayRef); // 1 based
                } else if (!parsedPseudoClass.offset && parsedPseudoClass.step) {
                    if (['odd', 'even'].includes(parsedPseudoClass.step)) {
                        duplicateMultipleSiblings(4, siblingArrayRef);
                        const index = parsedPseudoClass.step === 'even' ? 3 : 4;
                        moveRefToSiblingByIndex(index, siblingArrayRef); // last even sibling
                    } else {
                        const step = Math.abs(parseStep(parsedPseudoClass.step));
                        duplicateMultipleSiblings(step * 2, siblingArrayRef, { moveRefToLast: true });
                    }
                } else if (parsedPseudoClass.name === 'not') {
                    const notElements = selector.nodes!.flatMap((node) => visualize(stringifySelectorAst(node)));
                    currentElement = siblingArrayRef.at(-1) ?? baseElement;

                    const appendOtherElement = notElements.some(
                        (notElement) => JSON.stringify(notElement) === JSON.stringify(currentElement)
                    );

                    if (appendOtherElement) {
                        Object.assign(currentElement, { tag: 'some-other-element' });
                    }

                    if (siblingArrayRef)
                        addSiblings({
                            element: currentElement,
                            siblings: notElements,
                            siblingArrayRef,
                        });
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
                duplicateElementAsSibling(currentElement, siblingArrayRef, { moveRef: true });
            }
            if (value === 'first-child' || value === 'first-of-type') {
                duplicateElementAsSibling(currentElement, siblingArrayRef, { moveRef: false });
            }
        } else if (selector.type === 'combinator') {
            const [combinator] = selector.value;

            if (combinator === ' ') {
                // Child combinators
                siblingArrayRef = addChild({ parent: currentElement, child: baseElement, moveRefToChild: true });
            } else if (combinator === '>') {
                siblingArrayRef = addChild({ parent: currentElement, moveRefToChild: true });
                duplicateNext = true;
                continue;
            } else if (combinator === '+') {
                adjacentCount--;
                siblingArrayRef.push({ ...baseElement });
                moveRefToSiblingByIndex(-1, siblingArrayRef);
                if (adjacentCount === 0) {
                    // Only last element of adjacent combinator will be duplicated
                    duplicateAsSibling = true;
                }
            } else if (combinator === '~') {
                addSiblings({ element: currentElement, siblingArrayRef, moveRef: true });
            }
        } else if (selector.type === 'universal') {
            // not moving the reference allow adding children to adjacent elements
            addSiblings({ element: currentElement, siblings: [{ ...baseElement, tag: 'span' }], siblingArrayRef });
            addSiblings({ element: currentElement, siblings: [{ ...baseElement, tag: 'a' }], siblingArrayRef });
        }

        if (duplicateNext) {
            addChild({ parent: currentElement, child: currentElement });
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

interface AppendMultipleSiblingsOptions {
    moveRefToLast?: boolean;
}
function duplicateMultipleSiblings(
    amount: number,
    siblingArrayRef: VisualizationElement[],
    options: AppendMultipleSiblingsOptions = {}
) {
    for (let index = 0; index < amount; index++) {
        duplicateElementAsSibling(currentElement, siblingArrayRef, { moveRef: false });
    }

    if (options.moveRefToLast) {
        currentElement = siblingArrayRef[siblingArrayRef.length - 1];
    }
}
interface DuplicateElementAsSiblingOptions {
    moveRef?: boolean;
}
function duplicateElementAsSibling(
    element: VisualizationElement,
    siblingArrayRef: VisualizationElement[],
    options: DuplicateElementAsSiblingOptions = {}
) {
    const newSibling = { ...element };
    siblingArrayRef.push(newSibling);
    if (options.moveRef) {
        currentElement = newSibling;
    }
}

interface AddChildOptions {
    parent: VisualizationElement;
    child?: VisualizationElement;
    moveRefToChild?: boolean;
}
function addChild({ parent, child = baseElement, moveRefToChild }: AddChildOptions) {
    const newChild = { ...child };

    if (!parent.children) {
        parent.children = [];
    }
    parent.children.push(newChild);

    if (moveRefToChild) {
        currentElement = parent.children.at(-1)!;
    }

    return parent.children;
}

interface AddSiblingOptions {
    element: VisualizationElement;
    siblingArrayRef: VisualizationElement[];
    siblings?: VisualizationElement[];
    moveRef?: boolean;
    adjacent?: boolean;
}
function addSiblings({ element, siblingArrayRef, siblings, moveRef, adjacent }: AddSiblingOptions) {
    const newSiblings = siblings?.length ? [...siblings] : [{ ...baseElement }];
    const lastIndex = getLastIndex(siblingArrayRef);
    if (adjacent) {
        const currentElementIndex = siblingArrayRef.indexOf(element);
        siblingArrayRef.splice(currentElementIndex + 1, 0, ...newSiblings);
    } else {
        siblingArrayRef.push(...newSiblings);
    }

    if (moveRef) {
        currentElement = siblingArrayRef.at(lastIndex + 1)!;
    }
}

function moveRefToSiblingByIndex(index: number, siblingArrayRef: VisualizationElement[]) {
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
