export const classes = [
    { name: 'A single class selector', selector: '.a', result: `An element with class 'a'` },
    { name: 'A double class selector', selector: '.a.b', result: `An element with classes 'a' and 'b'` },
    { name: 'Multiple class selector', selector: '.a.b.c', result: `An element with classes 'a', 'b' and 'c'` },
    {
        name: '2 Separate class selectors',
        selector: '.a, .b',
        result: `An element with class 'a' and an element with class 'b'`,
    },
    {
        name: '3 Separate class selectors',
        selector: '.a, .b, .c',
        result: `An element with class 'a', an element with class 'b' and an element with class 'c'`,
    },
    {
        name: 'element with 2 classes within an element with 2 classes',
        selector: '.a.c .b.a',
        result: `An element with classes 'b' and 'a' within an element with classes 'a' and 'c'`,
    },
    {
        name: 'Omits duplicate classnames',
        selector: '.a.a',
        result: `An element with class 'a'`,
    },
    {
        name: 'Omits duplicate classnames - with element',
        selector: 'div.a.a',
        result: `A '<div>' element with class 'a'`,
    },
    {
        name: 'A single element with one class',
        selector: 'p.a',
        result: `A '<p>' element with class 'a'`,
    },
    {
        name: 'A single element with 2 classes',
        selector: 'p.a.b',
        result: `A '<p>' element with classes 'a' and 'b'`,
    },
    {
        name: 'A single element with multiple classes',
        selector: 'div.a.b.c',
        result: `A '<div>' element with classes 'a', 'b' and 'c'`,
    },
    {
        name: 'A single element with multiple classes (vowel prefix)',
        selector: 'a.a.b.c',
        result: `An '<a>' element with classes 'a', 'b' and 'c'`,
    },
];
