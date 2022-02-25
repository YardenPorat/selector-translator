export const pseudoClassWithNodes = new Set(['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type', 'lang']);

export const ERRORS = {
    TWO_IDS: 'An element cannot have two ids',
    EMPTY_CLASS: 'You specified an empty class',
    EMPTY_ID: 'You specified an empty id',
    EMPTY_PSEUDO_CLASS: 'You specified an empty pseudo class',
    PSEUDO_ELEMENT_AS_PSEUDO_CLASS: (el: string) => `You specified the pseudo element '${el}' as a pseudo class`,
    UNKNOWN_PSEUDO_ELEMENT: (el: string) => `Unknown pseudo element '${el}'`,
    MULTIPLE_PSEUDO_ELEMENT: `You cannot have multiple pseudo elements on a single selector`,
    EMPTY_PSEUDO_CLASS_NODE: 'You specified an empty pseudo class node',
    EXPECTED_PSEUDO_CLASS_NODE: `You specified a pseudo class which is expected to have a node (${[
        ...pseudoClassWithNodes,
    ].join(', ')})`,
    EMPTY_REQUIRED_NODE: 'You specified a pseudo class with an empty node',
    INCORRECT_PSEUDO_CLASS_NODE: (node: string) => `You specified an incorrect pseudo class node: '${node}'`,
};
