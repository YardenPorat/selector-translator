export const pseudoClassWithNodes = new Set([
    'nth-child',
    'nth-last-child',
    'nth-of-type',
    'nth-last-of-type',
    'lang',
    'not',
    'where',
]);

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
    INCORRECT_PSEUDO_CLASS_NODE: (node: string) => `Incorrect pseudo class node was specified: '${node}'`,
    NTH_OF_NOT_SUPPORTED: 'Nth of syntax is not supported',
    NESTED_NOT_PSEUDO_CLASS: 'The pseudo class "not" cannot be nested',
    ABUSED_NOT_PSEUDO_CLASS:
        'Having a universal selector within a not pseudo class is meaningless (select everything which is not everything)',
};
