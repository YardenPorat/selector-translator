import { expect } from 'chai';
import { getTranslation } from './utils/get-translation';
import { visualize } from '../ui/visualization/visualize';

describe('Pseudo Class', () => {
    it('element + hover', function () {
        const selector = 'a:hover';
        expect(getTranslation(selector)).to.eq(`An '<a>' element when its hovered`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a', innerText: 'When its hovered' }]);
    });

    it('element + active', function () {
        const selector = 'a:active';
        expect(getTranslation(selector), selector).to.eq(`An '<a>' element when its active`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a', innerText: 'When its active (Click on me!)' }]);
    });

    it('element + focus', function () {
        const selector = 'input:focus';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its focused`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', innerText: 'When its focused (Use with input / textarea)' },
        ]);
    });

    it('element + visited', function () {
        const selector = 'a:visited';
        expect(getTranslation(selector), selector).to.eq(`An '<a>' element when its visited`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'a', innerText: 'When its visited (A link that was already clicked)' },
        ]);
    });

    it('element + empty', function () {
        const selector = 'p:empty';
        expect(getTranslation(selector), selector).to.eq(`A '<p>' element when its empty`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p', innerText: 'When its empty' }]);
    });

    it('element + blank', function () {
        const selector = 'p:blank';
        expect(getTranslation(selector), selector).to.eq(`A '<p>' element when its blank`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p', innerText: 'When its blank' }]);
    });

    it('target', function () {
        const selector = ':target';
        expect(getTranslation(selector), selector).to.eq(`Any element when its targeted`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div', innerText: 'When its targeted' }]);
    });

    it('element + target', function () {
        const selector = 'p:target';
        expect(getTranslation(selector), selector).to.eq(`A '<p>' element when its targeted`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p', innerText: 'When its targeted' }]);
    });

    it('element + lang(en)', function () {
        const selector = 'p:lang(en)';
        expect(getTranslation(selector), selector).to.eq(`A '<p>' element when its language is 'en'`);
        expect(visualize(selector)).to.deep.eq([
            {
                tag: 'p',
                innerText: "When its language is 'en'",
                attributes: {
                    lang: 'en',
                },
            },
        ]);
    });

    it('element + checked', function () {
        const selector = 'input:checked';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its checked`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its checked' }]);
    });

    it('element + indeterminate', function () {
        const selector = 'input:indeterminate';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its indeterminate`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its indeterminate' }]);
    });

    it('element + disabled', function () {
        const selector = 'input:disabled';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its disabled`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { disabled: 'true' }, innerText: 'When its disabled' },
        ]);
    });

    it('element + required', function () {
        const selector = 'input:required';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its required`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { required: 'true' }, innerText: 'When its required' },
        ]);
    });

    it('element + optional', function () {
        const selector = 'input:optional';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its optional`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its optional (Not required)' }]);
    });

    it('element + valid', function () {
        const selector = 'input:valid';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its valid`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its valid (Input value)' }]);
    });

    it('element + invalid', function () {
        const selector = 'input:invalid';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its invalid`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { type: 'email' }, innerText: 'When its invalid' },
        ]);
    });

    it('element + read-only', function () {
        const selector = 'input:read-only';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its read-only`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { readonly: 'true' }, innerText: 'When its read-only' },
        ]);
    });

    it('element + read-write', function () {
        const selector = 'input:read-write';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its read-write`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', innerText: 'When its read-write (Without readonly attribute)' },
        ]);
    });

    it('element + in-range', function () {
        const selector = 'input:in-range';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its in-range`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { min: '5', max: '10' }, innerText: 'When its in-range' },
        ]);
    });

    it('element + out-of-range', function () {
        const selector = 'input:out-of-range';
        expect(getTranslation(selector), selector).to.eq(`An '<input>' element when its out-of-range`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { min: '5', max: '10' }, innerText: 'When its out-of-range' },
        ]);
    });

    it('element + last-child', function () {
        const selector = 'li:last-child';
        expect(getTranslation(selector), selector).to.eq(`An '<li>' element when its the last child of its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the last child of its parent' },
            { tag: 'li', innerText: 'When its the last child of its parent' },
        ]);
    });

    it('element:first-child', function () {
        const selector = 'li:first-child';
        expect(getTranslation(selector), selector).to.eq(`An '<li>' element when its the first child of its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the first child of its parent' },
            { tag: 'li', innerText: 'When its the first child of its parent' },
        ]);
    });

    it('element:first-child element', function () {
        const selector = 'li:first-child a';
        expect(getTranslation(selector), selector).to.eq(
            `An '<a>' element within an '<li>' element when its the first child of its parent`
        );
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the first child of its parent', children: [{ tag: 'a' }] },
            { tag: 'li', innerText: 'When its the first child of its parent' },
        ]);
    });

    it('element + only-child', function () {
        const selector = 'li:only-child';
        expect(getTranslation(selector), selector).to.eq(`An '<li>' element when its the only child of its parent`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'li', innerText: 'When its the only child of its parent' }]);
    });

    it('element + first-of-type', function () {
        const selector = 'li:first-of-type';
        expect(getTranslation(selector), selector).to.eq(
            `An '<li>' element when its the first child of its type in its parent`
        );
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the first child of its type in its parent' },
            { tag: 'li', innerText: 'When its the first child of its type in its parent' },
        ]);
    });

    it('element + last-of-type', function () {
        const selector = 'li:last-of-type';
        expect(getTranslation(selector), selector).to.eq(
            `An '<li>' element when its the last child of its type in its parent`
        );
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the last child of its type in its parent' },
            { tag: 'li', innerText: 'When its the last child of its type in its parent' },
        ]);
    });

    it('element + only-of-type', function () {
        const selector = 'li:only-of-type';
        expect(getTranslation(selector), selector).to.eq(
            `An '<li>' element when its the only of its type in its parent`
        );
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the only of its type in its parent' },
        ]);
    });

    it('element + Multiple pseudo classes', function () {
        const selector = 'a:active:hover';
        expect(getTranslation(selector), selector).to.eq(`An '<a>' element when its active and hovered`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a', innerText: 'When its active (Click on me!) and hovered' }]);
    });

    it('element.class + element:Multiple pseudo classes', function () {
        const selector = 'ul.cls li:last-child:hover';
        expect(getTranslation(selector), selector).to.eq(
            `An '<li>' element when its the last child of its parent and hovered within a '<ul>' element with a class of 'cls'`
        );
        expect(visualize(selector)).to.deep.eq([
            {
                tag: 'ul',
                classes: ['cls'],
                children: [
                    { tag: 'li', innerText: 'When its the last child of its parent' },
                    { tag: 'li', innerText: 'When its the last child of its parent and hovered' },
                ],
            },
        ]);
    });

    describe(':not()', function () {
        it(':not(element)', function () {
            const selector = ':not(p)';
            expect(getTranslation(selector), selector).to.eq(`Any element when its not a '<p>' element`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':not(class)', function () {
            const selector = ':not(.cls)';
            expect(getTranslation(selector)).to.eq(`Any element when its not an element with a class of 'cls'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'div', classes: ['cls'] }]);
        });

        it(':not(div):not(el2)', function () {
            const selector = ':not(div):not(span)';
            expect(getTranslation(selector), selector).to.eq(
                `Any element when its not a '<div>' element and not a '<span>' element`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'some-other-element' }, { tag: 'div' }, { tag: 'span' }]);
        });

        it(':not(el1):not(el2)', function () {
            const selector = ':not(span):not(a)';
            expect(getTranslation(selector), selector).to.eq(
                `Any element when its not a '<span>' element and not an '<a>' element`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'span' }, { tag: 'a' }]);
        });

        it(':not(div, cls)', function () {
            const selector = ':not(div, .fancy)';
            expect(getTranslation(selector)).to.eq(
                `Any element when its not a '<div>' element or an element with a class of 'fancy'`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'some-other-element' },
                { tag: 'div' },
                { tag: 'div', classes: ['fancy'] },
            ]);
        });

        it(':not(el, cls)', function () {
            const selector = ':not(span, .fancy)';
            expect(getTranslation(selector)).to.eq(
                `Any element when its not a '<span>' element or an element with a class of 'fancy'`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'div' },
                { tag: 'span' },
                { tag: 'div', classes: ['fancy'] },
            ]);
        });

        it('el :not(div, cls)', function () {
            const selector = 'body :not(div, .fancy)';
            expect(getTranslation(selector)).to.eq(
                `An element when its not a '<div>' element or an element with a class of 'fancy' within a '<body>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'body',
                    children: [{ tag: 'some-other-element' }, { tag: 'div' }, { tag: 'div', classes: ['fancy'] }],
                },
            ]);
        });

        it('el :not(el.cls)', function () {
            const selector = 'h2 :not(span.foo)';
            expect(getTranslation(selector)).to.eq(
                `An element when its not a '<span>' element with a class of 'foo' within an '<h2>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'h2',
                    children: [{ tag: 'div' }, { tag: 'span', classes: ['foo'] }],
                },
            ]);
        });

        describe('Errors', function () {
            it(':not()', function () {
                const selector = ':not()';
                expect(getTranslation(selector)).to.eq(`Error: You specified a pseudo class with an empty node`);
            });
            it(':not(:not(el))', function () {
                const selector = ':not(:not(el))';
                expect(getTranslation(selector)).to.eq(`Error: The pseudo class "not" cannot be nested`);
            });
            it(':not(*)', function () {
                expect(getTranslation(':not(*)')).to.eq(
                    `Error: Having a universal selector within a not pseudo class is meaningless (select everything which is not everything)`
                );
            });
        });
    });

    describe(':where()', function () {
        it(':where(element)', function () {
            const selector = ':where(p)';
            expect(getTranslation(selector)).to.eq(`Any element when its a '<p>' element`);
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(el, el, el)', function () {
            const selector = ':where(a, b, c)';
            expect(getTranslation(selector)).to.eq(
                `Any element when its an '<a>' element, a '<b>' element or a '<c>' element`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(el, el, el) el:pseudoClass', function () {
            /* Selects any paragraph inside a header, main or footer element that is being hovered */
            const selector = ':where(a, b, c) p:hover';
            expect(getTranslation(selector)).to.eq(
                `A '<p>' element when its hovered within an element when its an '<a>' element, a '<b>' element or a '<c>' element`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(:valid)', function () {
            const selector = ':where(:valid)';
            expect(getTranslation(selector)).to.eq(`Any element when its valid`);
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it('Forgiving Selector Parsing (:valid, :unsupported)', function () {
            const selector = ':where(:valid, :unsupported)';
            expect(getTranslation(selector)).to.eq(`Any element when its valid or unsupported (unknown pseudo class)`);
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(section.where-styling, aside.where-styling, footer.where-styling) a', function () {
            const selector = ':where(section.where-styling, aside.where-styling, footer.where-styling) a';
            expect(getTranslation(selector)).to.eq(
                `An '<a>' element within an element when its a '<section>' element with a class of 'where-styling', an '<aside>' element with a class of 'where-styling' or a '<footer>' element with a class of 'where-styling'`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });
        it('main :where(h1, h2, h3)', function () {
            const selector = 'main :where(h1, h2, h3)';
            expect(getTranslation(selector)).to.eq(
                `An element when its an '<h1>' element, an '<h2>' element or an '<h3>' element within a '<main>' element`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(.header, .footer) a', function () {
            const selector = ':where(.header, .footer) a';
            expect(getTranslation(selector)).to.eq(
                `An '<a>' element within an element with a class of 'header' or with a class of 'footer'`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it('h3:where(#specific-header)', function () {
            const selector = 'h3:where(#specific-header)';
            expect(getTranslation(selector)).to.eq(`An '<h3>' element when its with the id of 'specific-header'`);
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it('.dim-theme :where(button, a)', function () {
            const selector = '.dim-theme :where(button, a)';
            expect(getTranslation(selector)).to.eq(
                `An element when its a '<button>' element or an '<a>' element within an element with a class of 'dim-theme'`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(.dark-theme, .dim-theme) :where(button, a)', function () {
            const selector = ':where(.dark-theme, .dim-theme) :where(button, a)';
            expect(getTranslation(selector)).to.eq(
                `An element when its a '<button>' element or an '<a>' element within an element with a class of 'dark-theme' or with a class of 'dim-theme'`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });

        it(':where(ol[class])', function () {
            const selector = ':where(ol[class])';
            expect(getTranslation(selector)).to.eq(
                `Any element when its an '<ol>' element with an attribute of 'class'`
            );
            // expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'p' }]);
        });
    });

    describe('Formulas', () => {
        describe('Offset only', () => {
            it('element + nth-child(1)', function () {
                const selector = 'li:nth-child(1)';
                expect(getTranslation(selector)).to.eq(`An '<li>' element when its the 1st child of its parent`);
                expect(visualize(selector)).to.deep.eq(new Array(2).fill({ tag: 'li' }));
            });

            it('element + nth-last-child(2)', function () {
                const selector = 'li:nth-last-child(2)';
                expect(getTranslation(selector)).to.eq(
                    `An '<li>' element when its the 2nd child from the end of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(3).fill({ tag: 'li' }));
            });

            it('element + nth-of-type(3)', function () {
                const selector = 'li:nth-of-type(3)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its the 3rd child of its type in his parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(4).fill({ tag: 'li' }));
            });

            it('element + nth-last-of-type(4)', function () {
                const selector = 'li:nth-last-of-type(4)';
                expect(getTranslation(selector)).to.eq(
                    `An '<li>' element when its the 4th child of its type from the end in his parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });

            it('element + nth-child(30)', function () {
                const selector = 'li:nth-child(30)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its the 30th child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(31).fill({ tag: 'li' }));
            });

            it('el:nth-child(x)::first-line', function () {
                const selector = 'div:nth-child(2)::first-line';
                expect(getTranslation(selector), selector).to.eq(
                    `The 'first line' of a '<div>' element when its the 2nd child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(
                    new Array(3).fill(undefined).flatMap(() => [
                        {
                            tag: 'div',
                            children: [
                                {
                                    attributes: {
                                        data: 'first-child',
                                    },
                                    hideTag: true,
                                    innerText: 'First line',
                                    tag: 'div',
                                },
                                {
                                    hideTag: true,
                                    innerText: 'Second line',
                                    tag: 'div',
                                },
                                {
                                    hideTag: true,
                                    innerText: '</div>',
                                    tag: 'internal',
                                    attributes: {
                                        style: 'margin-left: -5px',
                                    },
                                },
                            ],
                        },
                    ])
                );
            });
        });

        describe('Offset and Step', () => {
            describe('nth-last-child', () => {
                it('-n+Y', function () {
                    const selector = 'li:nth-child(-n+3)';
                    expect(getTranslation(selector), selector).to.eq(
                        `An '<li>' element when its every child starting with the 3rd child of its parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('-Xn+Y', function () {
                    const selector = 'li:nth-child(-2n+3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every 2nd child starting with the 3rd child of its parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('+Xn-Y', function () {
                    const selector = 'li:nth-child(2n-3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every 2nd child starting with the -3rd child of its parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('+Xn- Y (with space)', function () {
                    const selector = 'li:nth-child(2n- 3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every 2nd child starting with the -3rd child of its parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('+Xn + Y (with 2 spaces)', function () {
                    const selector = 'li:nth-child(2n + 3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every 2nd child starting with the 3rd child of its parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });
            });

            it('element + nth-of-type(-Xn+Y)', function () {
                const selector = 'li:nth-of-type(-2n+4)';
                expect(getTranslation(selector)).to.eq(
                    `An '<li>' element when its every 2nd child of type starting with the 4th child of its type in his parent (inclusive), going down`
                );
                expect(visualize(selector)).to.deep.eq(new Array(9).fill({ tag: 'li' }));
            });

            describe('nth-last-child', () => {
                it('element + nth-last-child: n+Y', function () {
                    const selector = 'li:nth-last-child(n+3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every child starting with the 3rd child from the end of its parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });
            });

            describe('nth-last-of-type', () => {
                it('n+Y', function () {
                    const selector = 'li:nth-last-of-type(n+3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every child of type starting with the 3rd child of its type from the end in his parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('-n+Y', function () {
                    const selector = 'li:nth-last-of-type(-n+3)';
                    expect(getTranslation(selector)).to.eq(
                        `An '<li>' element when its every child of type starting with the 3rd child of its type from the end in his parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('Xn+Y', function () {
                    const selector = 'li:nth-last-of-type(3n+5)';
                    expect(getTranslation(selector), selector).to.eq(
                        `An '<li>' element when its every 3rd child of type starting with the 5th child of its type from the end in his parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(11).fill({ tag: 'li' }));
                });

                it('-Xn+Y', function () {
                    const selector = 'li:nth-last-of-type(-3n+5)';
                    expect(getTranslation(selector), selector).to.eq(
                        `An '<li>' element when its every 3rd child of type starting with the 5th child of its type from the end in his parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(11).fill({ tag: 'li' }));
                });
            });
        });

        describe('Even and Odd', () => {
            it('element + nth-child(even)', function () {
                const selector = 'li:nth-child(even)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its every even child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });

            it('el1:nth-child(even) el2', function () {
                const selector = 'li:nth-child(even) span';
                expect(getTranslation(selector), selector).to.eq(
                    `A '<span>' element within an '<li>' element when its every even child of its parent`
                );
                const expected = new Array(5).fill(undefined).map(() => ({ tag: 'li', children: [{ tag: 'span' }] }));
                expect(visualize(selector)).to.deep.eq(expected);
            });

            it('element + nth-child(odd)', function () {
                const selector = 'li:nth-child(odd)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its every odd child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });

            it('el1:nth-child(odd) el2', function () {
                const selector = 'li:nth-child(odd) span';
                expect(getTranslation(selector), selector).to.eq(
                    `A '<span>' element within an '<li>' element when its every odd child of its parent`
                );
                const expected = new Array(5).fill(undefined).map(() => ({ tag: 'li', children: [{ tag: 'span' }] }));
                expected[4].children = [{ tag: 'span' }];
                expect(visualize(selector)).to.deep.eq(expected);
            });
        });
        describe('Step only', () => {
            it('element + nth-child(2n)', function () {
                const selector = 'li:nth-child(2n)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its every 2nd child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });

            it('element + nth-child(2N) [CAPITALIZED]', function () {
                const selector = 'li:nth-child(2N)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its every 2nd child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });

            it('element + nth-child(-2n)', function () {
                const selector = 'li:nth-child(-2n)';
                expect(getTranslation(selector), selector).to.eq(
                    `An '<li>' element when its every 2nd child of its parent, going down (non shown because selection starts at 0, going down)`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });
        });
    });

    describe('Unknown pseudo-classes', () => {
        // No visualizations for unknown pseudo-classes
        it('without formula', function () {
            const selector = 'div:a';
            expect(getTranslation(selector), selector).to.eq(`A '<div>' element when its a (unknown pseudo class)`);
        });

        it('with formula', function () {
            expect(getTranslation('li:nth-last-lol(2n+1)')).to.eq(
                `An '<li>' element when its nth-last-lol (unknown pseudo class)`
            );
        });

        it('With empty node', function () {
            expect(getTranslation(':nested-pseudo-class-x()')).to.eq(
                `Any element when its nested-pseudo-class-x (unknown pseudo class)`
            );
        });
    });

    describe('Errors', () => {
        // No visualizations due to errors
        it('Missing pseudo-class', function () {
            expect(getTranslation('div:')).to.eq(`Error: You specified an empty pseudo class`);
        });

        it('Pseudo-class which is suppose to be a pseudo element', function () {
            expect(getTranslation('div:after')).to.eq(
                `Error: You specified the pseudo element 'after' as a pseudo class`
            );
        });

        it('Pseudo-class with missing required node', function () {
            const expectedError =
                'Error: You specified a pseudo class which is expected to have a node (nth-child, nth-last-child, nth-of-type, nth-last-of-type, lang, not, where)';
            expect(getTranslation(':nth-child')).to.eq(expectedError);
            expect(getTranslation(':nth-last-child')).to.eq(expectedError);
            expect(getTranslation(':nth-of-type')).to.eq(expectedError);
            expect(getTranslation(':nth-last-of-type')).to.eq(expectedError);
            expect(getTranslation(':lang')).to.eq(expectedError);
        });

        it('Pseudo-class with empty node', function () {
            const expectedError = 'Error: You specified a pseudo class with an empty node';
            expect(getTranslation(':nth-child()')).to.eq(expectedError);
            expect(getTranslation(':nth-last-child()')).to.eq(expectedError);
            expect(getTranslation(':nth-of-type()')).to.eq(expectedError);
            expect(getTranslation(':nth-last-of-type()')).to.eq(expectedError);
            expect(getTranslation(':lang()')).to.eq(expectedError);
        });

        it('Pseudo-class with node error node', function () {
            const expectedError = 'Error: Incorrect pseudo class node was specified: ';

            expect(getTranslation(':nth-child(3 2n)')).to.eq(expectedError + `'3 2n'`);
            expect(getTranslation(':nth-child(2n 3)')).to.eq(expectedError + `'2n 3'`);
            expect(getTranslation(':nth-child(2n3)')).to.eq(expectedError + `'2n3'`);
            expect(getTranslation(':nth-child(+)')).to.eq(expectedError + `'+'`);
            expect(getTranslation(':nth-last-child(abc)')).to.eq(expectedError + `'abc'`);
            expect(getTranslation(':nth-of-type(!)')).to.eq(expectedError + `'!'`);
        });

        it('nth of not supported', function () {
            expect(getTranslation(':nth-child(2n + 3 of div.cls)')).to.eq('Error: Nth of syntax is not supported');
        });
    });
});
