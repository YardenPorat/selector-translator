import { parseCssSelector, PseudoClass, stringifySelectorAst } from '@tokey/css-selector-parser';
import { parsePseudoClassNode, parseStep, PSEUDO_CLASS_STATE } from '../../translate/helpers/pseudo-classes';
import { addAttributes, getAttribute, getAttributeDomName } from './attribute-helpers';
import { IS, NOT, WHERE } from '../../consts';
import type { VisualizationElement } from './create-element';
import type { PseudoClassName } from '../../translate/types';

const getLastIndex = (arr: any[]) => arr.length - 1;

export function visualize(selector: string, noBaseTag = false) {
    let currentElement: VisualizationElement;
    const [selectorList] = parseCssSelector(selector); // first selector, before the ','
    const baseElement: VisualizationElement = noBaseTag ? {} : { tag: 'div' };

    const elements: VisualizationElement[] = [{ ...baseElement }];
    let siblingArrayRef = elements;
    currentElement = elements[0];
    let duplicateNext = false;
    let duplicateAsSibling = false;
    let adjacentCount = selector.split('+').length - 1;

    for (const selector of selectorList.nodes) {
        const isLast = selectorList.nodes.indexOf(selector) === selectorList.nodes.length - 1;
        if (selector.type === 'type') {
            Object.assign(currentElement, { tag: selector.value });
        } else if (selector.type === 'class') {
            currentElement.classes = [...new Set([...(currentElement.classes ?? []), selector.value])];
        } else if (selector.type === 'id') {
            Object.assign(currentElement, { id: selector.value });
        } else if (selector.type === 'attribute') {
            const { attr, value } = getAttribute(selector.value);
            addAttributes({ keyValues: [[attr, value]], currentElement });
        } else if (selector.type === 'pseudo_element') {
            if (selector.value === 'first-line') {
                addChild({
                    parent: currentElement,
                    currentElement,
                    child: {
                        tag: 'div',
                        innerText: 'First line',
                        attributes: { data: 'first-child' },
                        hideTag: true,
                    },
                });
                addChild({
                    parent: currentElement,
                    currentElement,
                    child: { tag: 'div', innerText: 'Second line', hideTag: true },
                });
                addChild({
                    parent: currentElement,
                    currentElement,
                    child: {
                        tag: 'internal',
                        innerText: `</${currentElement.tag!}>`,
                        attributes: { style: 'margin-left: -5px' }, // TODO: get this from css
                        hideTag: true,
                    },
                });
            }
            if (selector.value === 'first-letter') {
                addChild({
                    parent: currentElement,
                    currentElement,
                    child: {
                        tag: 'div',
                        innerText: 'First letter only',
                        attributes: { data: 'first-letter' },
                        hideTag: true,
                    },
                });
                addSiblings({
                    element: currentElement,
                    baseElement,
                    siblings: [
                        {
                            tag: currentElement.tag,
                            innerText: `</${currentElement.tag!}>`,
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
                    addAttributes({ keyValues: [[parsedPseudoClass.name, parsedPseudoClass.value!]], currentElement });
                } else if (parsedPseudoClass.offset && !parsedPseudoClass.step) {
                    const offset = Number(parsedPseudoClass.offset);
                    duplicateMultipleSiblings({ amount: offset, siblingArrayRef, currentElement });
                    getSiblingRef({ index: offset - 1, siblingArrayRef }); // 1 based
                } else if (parsedPseudoClass.offset && parsedPseudoClass.step) {
                    const offset = Math.abs(Number(parsedPseudoClass.offset));
                    duplicateMultipleSiblings({ amount: offset * 2, siblingArrayRef, currentElement });
                    getSiblingRef({ index: offset - 1, siblingArrayRef }); // 1 based
                } else if (!parsedPseudoClass.offset && parsedPseudoClass.step) {
                    if (['odd', 'even'].includes(parsedPseudoClass.step)) {
                        duplicateMultipleSiblings({ amount: 4, siblingArrayRef, currentElement });
                        const index = parsedPseudoClass.step === 'even' ? 3 : 4;
                        getSiblingRef({ index, siblingArrayRef }); // last even sibling
                    } else {
                        const step = Math.abs(parseStep(parsedPseudoClass.step));
                        duplicateMultipleSiblings({
                            amount: step * 2,
                            siblingArrayRef,
                            currentElement,
                            moveRefToLast: true,
                        });
                    }
                }

                const innerElements = selector.nodes!.flatMap((node) => stringifySelectorAst(node).trim());
                if (parsedPseudoClass.name === NOT) {
                    const visualizedInnerElements = innerElements.flatMap((el) => visualize(el));
                    currentElement = siblingArrayRef.at(-1) ?? baseElement;

                    const appendOtherElement = visualizedInnerElements.some(
                        (notElement) => JSON.stringify(notElement) === JSON.stringify(currentElement)
                    );

                    if (appendOtherElement) {
                        Object.assign(currentElement, { tag: 'some-other-element' });
                    }

                    if (siblingArrayRef) {
                        addSiblings({
                            element: currentElement,
                            siblings: visualizedInnerElements,
                            siblingArrayRef,
                            baseElement,
                        });
                    }
                } else if ([WHERE, IS].includes(parsedPseudoClass.name)) {
                    const visualizedInnerElements = innerElements.flatMap((el) => visualize(el, true));
                    currentElement = siblingArrayRef.at(-1) ?? baseElement;

                    if (siblingArrayRef) {
                        const { newSiblingsRef } = addSiblings({
                            element: currentElement,
                            siblings: visualizedInnerElements.map((el) => {
                                if (!el.tag) {
                                    Object.assign(el, { tag: currentElement.tag ?? 'div' });
                                }
                                return el;
                            }),
                            siblingArrayRef,
                            baseElement,
                        });

                        if (!isLast) {
                            /** add same ref for children, in case we have :where(a,b) :where(c,d) */
                            const children: VisualizationElement[] = [];
                            for (const sibling of newSiblingsRef) {
                                sibling.children = children;
                            }
                        }
                        currentElement = newSiblingsRef[0];
                    }
                }
            } else if (['disabled', 'required', 'read-only'].includes(value)) {
                //Adds boolean attributes for the pseudo class
                const attrName = getAttributeDomName(value);
                addAttributes({ keyValues: [[attrName, 'true']], currentElement });
                mainText = value;
            } else if (value === 'invalid') {
                addAttributes({ keyValues: [['type', 'email']], currentElement });
                mainText = value;
            } else if (value === 'in-range' || value === 'out-of-range') {
                addAttributes({
                    keyValues: [
                        ['min', '5'],
                        ['max', '10'],
                    ],
                    currentElement,
                });
                mainText = value;
            } else if (value === 'link') {
                addAttributes({ keyValues: [['href', 'http://google.com']], currentElement });
                mainText = 'with href attribute';
            } else {
                mainText = PSEUDO_CLASS_STATE[value].state;
            }

            const extraText = PSEUDO_CLASS_STATE[value].text ? ` (${PSEUDO_CLASS_STATE[value].text})` : '';

            if (mainText) {
                appendInnerText(mainText, extraText, currentElement);
            }

            if (value === 'last-child' || value === 'last-of-type') {
                const { newSibling } = duplicateElementAsSibling({ element: currentElement, siblingArrayRef });
                currentElement = newSibling;
            }
            if (value === 'first-child' || value === 'first-of-type') {
                duplicateElementAsSibling({ element: currentElement, siblingArrayRef });
            }
        } else if (selector.type === 'combinator') {
            const [combinator] = selector.value;

            if (combinator === ' ') {
                // Child combinators
                const { siblingArr, newChild } = addChild({
                    parent: currentElement,
                    currentElement,
                    child: baseElement,
                });
                siblingArrayRef = siblingArr;
                currentElement = newChild;
            } else if (combinator === '>') {
                const { siblingArr, newChild } = addChild({
                    parent: currentElement,
                    child: baseElement,
                    currentElement,
                });
                siblingArrayRef = siblingArr;
                currentElement = newChild;
                duplicateNext = true;
                continue;
            } else if (combinator === '+') {
                adjacentCount--;
                siblingArrayRef.push({ ...baseElement });
                const { siblingRef } = getSiblingRef({ index: -1, siblingArrayRef });
                currentElement = siblingRef;

                // Only last element of adjacent combinator will be duplicated
                if (adjacentCount === 0) {
                    duplicateAsSibling = true;
                }
            } else if (combinator === '~') {
                const { siblingArr } = addSiblings({ element: currentElement, siblingArrayRef, baseElement });
                currentElement = siblingArr[getLastIndex(siblingArr)];
            }
        } else if (selector.type === 'universal') {
            // not moving the reference allow adding children to adjacent elements
            addSiblings({
                element: currentElement,
                siblings: [{ ...baseElement, tag: 'span' }],
                siblingArrayRef,
                baseElement,
            });
            addSiblings({
                element: currentElement,
                siblings: [{ ...baseElement, tag: 'a' }],
                siblingArrayRef,
                baseElement,
            });
        }

        if (duplicateNext) {
            addChild({ parent: currentElement, child: currentElement, currentElement });
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

interface DuplicateMultipleSiblingsArgs {
    amount: number;
    siblingArrayRef: VisualizationElement[];
    currentElement: VisualizationElement;
    moveRefToLast?: boolean;
}
function duplicateMultipleSiblings({
    amount,
    siblingArrayRef,
    currentElement,
    moveRefToLast = false,
}: DuplicateMultipleSiblingsArgs) {
    for (let index = 0; index < amount; index++) {
        if (!Array.isArray(currentElement)) {
            siblingArrayRef.push(currentElement);
            // duplicateElementAsSibling({ element: currentElement, siblingArrayRef });
        } else {
            throw new Error('duplicateElementAsSibling array handling not implemented');
        }
    }

    if (moveRefToLast) {
        currentElement = siblingArrayRef[siblingArrayRef.length - 1];
    }
}
interface DuplicateElementAsSiblingArgs {
    element: VisualizationElement;
    siblingArrayRef: VisualizationElement[];
}
function duplicateElementAsSibling({ element, siblingArrayRef }: DuplicateElementAsSiblingArgs) {
    const newSibling = { ...element };
    siblingArrayRef.push(newSibling);

    return { newSibling };
}

interface AddChildOptions {
    parent: VisualizationElement;
    currentElement: VisualizationElement;
    child?: VisualizationElement;
}

/**
 * if no child is given, baseElement will be created as child.
 */
function addChild({ parent, child }: AddChildOptions) {
    const newChild = { ...child };

    /**
     * If parent is array, add same ref as a child for for each element in the array.
     * keep same ref for the added child.
     */
    if (Array.isArray(parent)) {
        const children = [newChild];

        parent.forEach((el) => {
            el['children'] = children;
        });

        return { siblingArr: children, newChild };
    }

    if (!parent.children) {
        parent.children = [];
    }
    parent.children.push(newChild);

    return { siblingArr: parent.children, newChild };
}

interface AddSiblingOptions {
    element: VisualizationElement;
    siblingArrayRef: VisualizationElement[];
    baseElement: VisualizationElement;
    siblings?: VisualizationElement[];
    adjacent?: boolean;
}

function addSiblings({ element, siblingArrayRef, baseElement, siblings, adjacent = false }: AddSiblingOptions) {
    const newSiblings = siblings?.length ? [...siblings] : [{ ...baseElement }];
    const siblingCount = newSiblings.length;
    const newSiblingsRef: VisualizationElement[] = [];

    if (adjacent) {
        const indices: number[] = [];
        let currentIndex = siblingArrayRef.indexOf(element);
        indices.push(currentIndex);

        while (currentIndex !== -1) {
            currentIndex = siblingArrayRef.indexOf(element, currentIndex + 1);
            if (currentIndex !== -1) {
                indices.push(currentIndex);
            }
        }

        // use entries to adjust indices as elements are added
        for (const [index, value] of indices.entries()) {
            siblingArrayRef.splice(value + 1 + index, 0, ...newSiblings);
            siblingArrayRef.slice(index + 1 + index, siblingCount).forEach((el) => newSiblings.push(el));
        }
    } else {
        siblingArrayRef.push(...newSiblings);
        siblingArrayRef
            .slice(siblingArrayRef.length - siblingCount, siblingCount + 1)
            .forEach((el) => newSiblingsRef.push(el));
    }

    return { siblingArr: siblingArrayRef, newSiblingsRef };
}

interface MoveRefToSiblingByIndexArgs {
    index: number;
    siblingArrayRef: VisualizationElement[];
}

function getSiblingRef({ index, siblingArrayRef }: MoveRefToSiblingByIndexArgs) {
    if (index === -1) {
        return { siblingRef: siblingArrayRef[getLastIndex(siblingArrayRef)] };
    }
    return { siblingRef: siblingArrayRef[index] };
}

function appendInnerText(mainText: string, secondaryText: string, currentElement: VisualizationElement) {
    const text = `${mainText}${secondaryText}`;
    if (currentElement.innerText) {
        currentElement.innerText += ` and ${text}`;
    } else {
        currentElement.innerText = `When its ${text}`;
    }
}
