import { expect } from 'chai';
import { translate } from '../translate/translate';
import { visualize } from '../visualize';

describe('Pseudo Class', () => {
    it('element + hover', function () {
        const selector = 'a:hover';
        expect(translate(selector)).to.eq(`An '<a>' element when its hovered`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a', innerText: 'When its hovered' }]);
    });

    it('element + active', function () {
        const selector = 'a:active';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its active`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a', innerText: 'When its active (Click on me!)' }]);
    });

    it('element + focus', function () {
        const selector = 'input:focus';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its focused`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', innerText: 'When its focused (Use with input / textarea)' },
        ]);
    });

    it('element + visited', function () {
        const selector = 'a:visited';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its visited`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'a', innerText: 'When its visited (A link that was already clicked)' },
        ]);
    });

    it('element + empty', function () {
        const selector = 'p:empty';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its empty`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p', innerText: 'When its empty' }]);
    });

    it('element + blank', function () {
        const selector = 'p:blank';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its blank`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p', innerText: 'When its blank' }]);
    });

    it('target', function () {
        const selector = ':target';
        expect(translate(selector), selector).to.eq(`Any element when its targeted`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div', innerText: 'When its targeted' }]);
    });

    it('element + target', function () {
        const selector = 'p:target';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its targeted`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p', innerText: 'When its targeted' }]);
    });

    it('element + lang(en)', function () {
        const selector = 'p:lang(en)';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its language is 'en'`);
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
        expect(translate(selector), selector).to.eq(`An '<input>' element when its checked`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its checked' }]);
    });

    it('element + indeterminate', function () {
        const selector = 'input:indeterminate';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its indeterminate`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its indeterminate' }]);
    });

    it('element + disabled', function () {
        const selector = 'input:disabled';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its disabled`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { disabled: 'true' }, innerText: 'When its disabled' },
        ]);
    });

    it('element + required', function () {
        const selector = 'input:required';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its required`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { required: 'true' }, innerText: 'When its required' },
        ]);
    });

    it('element + optional', function () {
        const selector = 'input:optional';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its optional`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its optional (Not required)' }]);
    });

    it('element + valid', function () {
        const selector = 'input:valid';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its valid`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'input', innerText: 'When its valid (Input value)' }]);
    });

    it('element + invalid', function () {
        const selector = 'input:invalid';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its invalid`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { type: 'email' }, innerText: 'When its invalid' },
        ]);
    });

    it('element + read-only', function () {
        const selector = 'input:read-only';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its read-only`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { readonly: 'true' }, innerText: 'When its read-only' },
        ]);
    });

    it('element + read-write', function () {
        const selector = 'input:read-write';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its read-write`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', innerText: 'When its read-write (Without readonly attribute)' },
        ]);
    });

    it('element + in-range', function () {
        const selector = 'input:in-range';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its in-range`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { min: '5', max: '10' }, innerText: 'When its in-range' },
        ]);
    });

    it('element + out-of-range', function () {
        const selector = 'input:out-of-range';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its out-of-range`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'input', attributes: { min: '5', max: '10' }, innerText: 'When its out-of-range' },
        ]);
    });

    it('element + last-child', function () {
        const selector = 'li:last-child';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the last child of its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the last child of its parent' },
            { tag: 'li', innerText: 'When its the last child of its parent' },
        ]);
    });

    it('element:first-child', function () {
        const selector = 'li:first-child';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the first child of its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the first child of its parent' },
            { tag: 'li', innerText: 'When its the first child of its parent' },
        ]);
    });

    it('element:first-child element', function () {
        const selector = 'li:first-child a';
        expect(translate(selector), selector).to.eq(
            `An '<a>' element within an '<li>' element when its the first child of its parent`
        );
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the first child of its parent', children: [{ tag: 'a' }] },
            { tag: 'li', innerText: 'When its the first child of its parent' },
        ]);
    });

    it('element + only-child', function () {
        const selector = 'li:only-child';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the only child of its parent`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'li', innerText: 'When its the only child of its parent' }]);
    });

    it('element + first-of-type', function () {
        const selector = 'li:first-of-type';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the first of its type in its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the first of its type in its parent' },
            { tag: 'li', innerText: 'When its the first of its type in its parent' },
        ]);
    });

    it('element + last-of-type', function () {
        const selector = 'li:last-of-type';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the last of its type in its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the last of its type in its parent' },
            { tag: 'li', innerText: 'When its the last of its type in its parent' },
        ]);
    });

    it('element + only-of-type', function () {
        const selector = 'li:only-of-type';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the only of its type in its parent`);
        expect(visualize(selector)).to.deep.eq([
            { tag: 'li', innerText: 'When its the only of its type in its parent' },
        ]);
    });

    it('element + Multiple pseudo classes', function () {
        const selector = 'a:active:hover';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its active and hovered`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a', innerText: 'When its active (Click on me!) and hovered' }]);
    });

    it('element.class + element:Multiple pseudo classes', function () {
        const selector = 'ul.phone_numbers li:last-child:hover';
        expect(translate(selector), selector).to.eq(
            `An '<li>' element when its the last child of its parent and hovered within a '<ul>' element with a class of 'phone_numbers'`
        );
        expect(visualize(selector)).to.deep.eq([
            {
                tag: 'ul',
                classes: ['phone_numbers'],
                children: [
                    { tag: 'li', innerText: 'When its the last child of its parent' },
                    { tag: 'li', innerText: 'When its the last child of its parent and hovered' },
                ],
            },
        ]);
    });

    describe('Formulas', () => {
        describe('Offset only', () => {
            it('element + nth-child(1)', function () {
                const selector = 'li:nth-child(1)';
                expect(translate(selector)).to.eq(`An '<li>' element when its the 1st child of its parent`);
                expect(visualize(selector)).to.deep.eq(new Array(2).fill({ tag: 'li' }));
            });

            it('element + nth-last-child(2)', function () {
                const selector = 'li:nth-last-child(2)';
                expect(translate(selector)).to.eq(
                    `An '<li>' element when its the 2nd child from the end of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(3).fill({ tag: 'li' }));
            });

            it('element + nth-of-type(3)', function () {
                const selector = 'li:nth-of-type(3)';
                expect(translate(selector), selector).to.eq(
                    `An '<li>' element when its the 3rd of its type in his parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(4).fill({ tag: 'li' }));
            });

            it('element + nth-last-of-type(4)', function () {
                const selector = 'li:nth-last-of-type(4)';
                expect(translate(selector)).to.eq(
                    `An '<li>' element when its the 4th of its type from the end in his parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });

            it('element + nth-child(30)', function () {
                const selector = 'li:nth-child(30)';
                expect(translate(selector), selector).to.eq(`An '<li>' element when its the 30th child of its parent`);
                expect(visualize(selector)).to.deep.eq(new Array(31).fill({ tag: 'li' }));
            });
        });

        describe('Offset and Step', () => {
            it('element + nth-child(-n+Y)', function () {
                const selector = 'li:nth-child(-n+3)';
                expect(translate(selector), selector).to.eq(
                    `An '<li>' element when its every child starting with the 3rd child of its parent (inclusive), going down`
                );
                expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
            });

            it('element + nth-child(-Xn+Y)', function () {
                const selector = 'li:nth-child(-2n+3)';
                expect(translate(selector)).to.eq(
                    `An '<li>' element when its every 2nd child starting with the 3rd child of its parent (inclusive), going down`
                );
                expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
            });

            it('element + nth-of-type(-Xn+Y)', function () {
                const selector = 'li:nth-of-type(-2n+4)';
                expect(translate(selector)).to.eq(
                    `An '<li>' element when its every 2nd child of type starting with the 4th of its type in his parent (inclusive), going down`
                );
                expect(visualize(selector)).to.deep.eq(new Array(9).fill({ tag: 'li' }));
            });

            describe('nth-last-child', () => {
                it('element + nth-last-child: n+Y', function () {
                    const selector = 'li:nth-last-child(n+3)';
                    expect(translate(selector)).to.eq(
                        `An '<li>' element when its every child starting with the 3rd child from the end of its parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });
            });

            describe('nth-last-of-type', () => {
                it('n+Y', function () {
                    const selector = 'li:nth-last-of-type(n+3)';
                    expect(translate(selector)).to.eq(
                        `An '<li>' element when its every child of type starting with the 3rd of its type from the end in his parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('-n+Y', function () {
                    const selector = 'li:nth-last-of-type(-n+3)';
                    expect(translate(selector)).to.eq(
                        `An '<li>' element when its every child of type starting with the 3rd of its type from the end in his parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(7).fill({ tag: 'li' }));
                });

                it('Xn+Y', function () {
                    const selector = 'li:nth-last-of-type(3n+5)';
                    expect(translate(selector), selector).to.eq(
                        `An '<li>' element when its every 3rd child of type starting with the 5th of its type from the end in his parent (inclusive), going down`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(11).fill({ tag: 'li' }));
                });

                it('-Xn+Y', function () {
                    const selector = 'li:nth-last-of-type(-3n+5)';
                    expect(translate(selector), selector).to.eq(
                        `An '<li>' element when its every 3rd child of type starting with the 5th of its type from the end in his parent (inclusive)`
                    );
                    expect(visualize(selector)).to.deep.eq(new Array(11).fill({ tag: 'li' }));
                });
            });
        });

        describe('Step only', () => {
            it('element + nth-child(even)', function () {
                const selector = 'li:nth-child(even)';
                expect(translate(selector), selector).to.eq(
                    `An '<li>' element when its every even child of its parent`
                );
                expect(visualize(selector)).to.deep.eq(new Array(3).fill({ tag: 'li' }));
            });

            it('element + nth-child(odd)', function () {
                const selector = 'li:nth-child(odd)';
                expect(translate(selector), selector).to.eq(`An '<li>' element when its every odd child of its parent`);
                expect(visualize(selector)).to.deep.eq(new Array(3).fill({ tag: 'li' }));
            });

            it('element + nth-child(2n)', function () {
                const selector = 'li:nth-child(2n)';
                expect(translate(selector), selector).to.eq(`An '<li>' element when its every 2nd child of its parent`);
                expect(visualize(selector)).to.deep.eq(new Array(5).fill({ tag: 'li' }));
            });
        });
    });

    describe('Unknown pseudo-classes', () => {
        // No visualizations for unknown pseudo-classes
        it('without formula', function () {
            const selector = 'div:a';
            expect(translate(selector), selector).to.eq(`A '<div>' element when its 'a' (unknown pseudo class)`);
        });

        it('with formula', function () {
            expect(translate('li:nth-last-chid(2n+1)')).to.eq(
                `An '<li>' element when its 'nth-last-chid' (unknown pseudo class)`
            );
        });
    });

    describe('Errors', () => {
        // No visualizations due to errors
        it('Missing pseudo-class', function () {
            expect(translate('div:')).to.eq(`Error: You specified an empty pseudo class`);
        });

        it('Pseudo-class which is suppose to be a pseudo element', function () {
            expect(translate('div:after')).to.eq(`Error: You specified the pseudo element 'after' as a pseudo class`);
        });

        it('Pseudo-class which is suppose to have a node', function () {
            const expectedError =
                'Error: You specified a pseudo class node which is expected to have a node (nth-child, nth-last-child, nth-of-type, nth-last-of-type, lang)';
            expect(translate(':nth-child')).to.eq(expectedError);
            expect(translate(':nth-last-child')).to.eq(expectedError);
            expect(translate(':nth-of-type')).to.eq(expectedError);
            expect(translate(':nth-last-of-type')).to.eq(expectedError);
            expect(translate(':lang')).to.eq(expectedError);
        });
    });
});
