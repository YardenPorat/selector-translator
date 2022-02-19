export const PSEUDO_ELEMENTS_DESCRIPTORS = {
    before: `The 'before' pseudo-element of`,
    after: `The 'after' pseudo-element of`,
    'first-line': `The 'first line' of`,
    'first-letter': `The first letter of`,
    placeholder: `The placeholder of`,
    marker: `The marker (numbering) of`,
    backdrop: `The backdrop of`,
    selection: `The highlighted selection of`,
};

export const isPseudoElement = (value: string) => Object.keys(PSEUDO_ELEMENTS_DESCRIPTORS).includes(value);
export type PseudoElement = keyof typeof PSEUDO_ELEMENTS_DESCRIPTORS | undefined;
