import { NthOf, parseCssSelector } from '@tokey/css-selector-parser';
import { PSEUDO_CLASS_STATE } from './translate/helpers/pseudo-classes';
import { PseudoClassName } from './translate/types';
import { VisualizationElement } from './ui/visualization/create';

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

export function visualize(selector: string) {
    const baseElement: VisualizationElement = { tag: 'div' };
    const [selectorList] = parseCssSelector(selector); // first selector, before the ','

    const tags: string[] = [''];

    const elements: VisualizationElement[] = [{ ...baseElement }];

    let siblingArrayRef = elements;
    let currentElement = elements[0];
    let duplicateNext = false;
    let duplicateAsSibling = false;
    let adjacentCount = selector.split('+').length - 1;

    for (const selector of selectorList.nodes) {
        //
        // console.log('selector:', selector, '\n', JSON.stringify(elements, null, 2));

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
            if (value === 'lang') {
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                const lang = (selector.nodes?.at(0)!.nodes.at(0) as NthOf).value;
                mainText = `${PSEUDO_CLASS_STATE[value].state} is '${lang}'`;
            } else {
                mainText = PSEUDO_CLASS_STATE[value].state;
            }

            const extraText = PSEUDO_CLASS_STATE[value].text ? ` (${PSEUDO_CLASS_STATE[value].text})` : '';
            currentElement.innerText = `When its ${mainText}${extraText}`;
        } else if (selector.type === 'combinator') {
            const [combinator] = selector.value;

            if (combinator === ' ') {
                // Child combinators
                addBaseChild(currentElement);
                moveRefToYoungestChild(currentElement);
            }
            if (combinator === '>') {
                addBaseChild(currentElement);
                moveRefToYoungestChild(currentElement);
                duplicateNext = true;
                continue;
            }
            if (combinator === '+') {
                adjacentCount--;
                siblingArrayRef.push({ ...baseElement });
                currentElement = siblingArrayRef[getLastIndex(siblingArrayRef)];
                if (adjacentCount === 0) {
                    // Only last element of adjacent combinator will be duplicated
                    duplicateAsSibling = true;
                }
                continue;
            }

            if (combinator === '~') {
                addBaseSibling(siblingArrayRef);
                continue;
            }
        } else if (selector.type === 'universal') {
            if (tags.at(-1) === '') {
                tags[tags.length - 1] = 'Any element';
            } else {
                tags.push('Any element');
            }
        }

        if (duplicateNext) {
            duplicateAsChild(currentElement);
        }

        if (duplicateAsSibling) {
            siblingArrayRef.push(currentElement);
            duplicateAsSibling = false;
        }
    }

    return elements;

    function duplicateAsChild(element: VisualizationElement) {
        element.children = [{ ...element }];
        duplicateNext = false;
    }

    function addBaseChild(element: VisualizationElement) {
        if (element.children) {
            element.children.push({ ...baseElement });
        } else {
            element.children = [{ ...baseElement }];
        }
        siblingArrayRef = element.children;
    }

    function addBaseSibling(siblingArrayRef: VisualizationElement[]) {
        const lastIndex = getLastIndex(siblingArrayRef);
        if (siblingArrayRef[lastIndex].children) {
            const newLength = siblingArrayRef[lastIndex].children!.push({ ...baseElement });
            currentElement = siblingArrayRef[lastIndex].children![newLength - 1];
        } else {
            const newLength = siblingArrayRef.push({ ...baseElement });
            currentElement = siblingArrayRef[newLength - 1];
        }
    }

    function moveRefToYoungestChild(el: VisualizationElement) {
        currentElement = el.children![getLastIndex(el.children!)];
    }
}
