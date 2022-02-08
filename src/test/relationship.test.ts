import { expect } from 'chai';
import { translate } from '../translate/translate';
import { visualize } from '../visualize';

describe('Relationships', () => {
    describe('Space combinator', function () {
        it('ul li', function () {
            const selector = 'ul li';
            expect(translate(selector)).to.eq(`An '<li>' element within a '<ul>' element`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'ul', children: [{ tag: 'li' }] }]);
        });
        it('ul li span', function () {
            const selector = 'ul li span';
            expect(translate(selector)).to.eq(`A '<span>' element within an '<li>' element within a '<ul>' element`);
            expect(visualize(selector)).to.deep.eq([
                { tag: 'ul', children: [{ tag: 'li', children: [{ tag: 'span' }] }] },
            ]);
        });

        it('a b c d c', function () {
            const selector = 'a b c d c';
            expect(translate(selector)).to.eq(
                `A '<c>' element within a '<d>' element within a '<c>' element within a '<b>' element within an '<a>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'a',
                    children: [
                        { tag: 'b', children: [{ tag: 'c', children: [{ tag: 'd', children: [{ tag: 'c' }] }] }] },
                    ],
                },
            ]);
        });
    });

    describe('Direct child (>)', function () {
        it('ul > li', function () {
            const selector = 'ul > li';
            expect(translate(selector)).to.eq(`An '<li>' element directly within a '<ul>' element`);
            expect(visualize(selector)).to.deep.eq([
                { tag: 'ul', children: [{ tag: 'li', children: [{ tag: 'li' }] }] },
            ]);
        });

        it('ul > li div', function () {
            const selector = 'ul > li div';
            expect(translate(selector)).to.eq(
                `A '<div>' element within an '<li>' element directly within a '<ul>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'ul', children: [{ tag: 'li', children: [{ tag: 'li' }, { tag: 'div' }] }] },
            ]);
        });

        it('ul > li div span', function () {
            const selector = 'ul > li div span';
            expect(translate(selector)).to.eq(
                `A '<span>' element within a '<div>' element within an '<li>' element directly within a '<ul>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'ul',
                    children: [{ tag: 'li', children: [{ tag: 'li' }, { tag: 'div', children: [{ tag: 'span' }] }] }],
                },
            ]);
        });

        it('ul > li > span', function () {
            const selector = 'ul > li > span';
            expect(translate(selector)).to.eq(
                `A '<span>' element directly within an '<li>' element directly within a '<ul>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'ul',
                    children: [{ tag: 'li', children: [{ tag: 'li' }, { tag: 'span', children: [{ tag: 'span' }] }] }],
                },
            ]);
        });

        it('ul > li > span div', function () {
            const selector = 'ul > li > span div';
            expect(translate(selector)).to.eq(
                `A '<div>' element within a '<span>' element directly within an '<li>' element directly within a '<ul>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'ul',
                    children: [
                        {
                            tag: 'li',
                            children: [{ tag: 'li' }, { tag: 'span', children: [{ tag: 'span' }, { tag: 'div' }] }],
                        },
                    ],
                },
            ]);
        });
    });

    describe('Directly adjacent (+)', function () {
        it('li + li', function () {
            const selector = 'li + li';
            expect(translate(selector)).to.eq(`An '<li>' element directly adjacent sibling to an '<li>' element`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'li' }, { tag: 'li' }, { tag: 'li' }]);
        });

        it('li + li + span', function () {
            const selector = 'li + li + span';
            expect(translate(selector)).to.eq(
                `A '<span>' element directly adjacent sibling to an '<li>' element directly adjacent sibling to an '<li>' element`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'li' }, { tag: 'li' }, { tag: 'span' }, { tag: 'span' }]);

            expect(visualize('li + li + span + a + z + f')).to.deep.eq([
                { tag: 'li' },
                { tag: 'li' },
                { tag: 'span' },
                { tag: 'a' },
                { tag: 'z' },
                { tag: 'f' }, // This will be selected
                { tag: 'f' },
            ]);
        });

        it('a+b+c+d+e', function () {
            const selector = 'a+b+c+d+e';
            expect(translate(selector)).to.eq(
                `An '<e>' element directly adjacent sibling to a '<d>' element directly adjacent sibling to a '<c>' element directly adjacent sibling to a '<b>' element directly adjacent sibling to an '<a>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'a' },
                { tag: 'b' },
                { tag: 'c' },
                { tag: 'd' },
                { tag: 'e' },
                { tag: 'e' },
            ]);
        });
    });

    describe('Subsequent-sibling (~)', function () {
        it('li ~ li', function () {
            const selector = 'li ~ li';
            expect(translate(selector)).to.eq(`An '<li>' element after a sibling which is an '<li>' element`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'li' }, { tag: 'li' }]);
        });

        it('a ~ a ~ a ~ a ~ a', function () {
            const selector = 'a ~ a ~ a ~ a ~ a';
            expect(translate(selector)).to.eq(
                `An '<a>' element after a sibling which is an '<a>' element after a sibling which is an '<a>' element after a sibling which is an '<a>' element after a sibling which is an '<a>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'a' },
                { tag: 'a' },
                { tag: 'a' },
                { tag: 'a' },
                { tag: 'a' },
            ]);
        });

        it('a ~ b ~ c ~ d ~ e', function () {
            const selector = 'a ~ b ~ c ~ d ~ e';
            expect(translate(selector)).to.eq(
                `An '<e>' element after a sibling which is a '<d>' element after a sibling which is a '<c>' element after a sibling which is a '<b>' element after a sibling which is an '<a>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'a' },
                { tag: 'b' },
                { tag: 'c' },
                { tag: 'd' },
                { tag: 'e' },
            ]);
        });

        it('div span ~ li', function () {
            const selector = 'div span ~ li';
            expect(translate(selector)).to.eq(
                `An '<li>' element after a sibling which is a '<span>' element within a '<div>' element`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', children: [{ tag: 'span' }, { tag: 'li' }] }]);
        });

        it('div + span ~ li', function () {
            const selector = 'div + span ~ li';
            expect(translate(selector)).to.eq(
                `An '<li>' element after a sibling which is a '<span>' element directly adjacent sibling to a '<div>' element`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'span' }, { tag: 'span' }, { tag: 'li' }]);
        });

        it('div + span ~ li + b ~ c + d', function () {
            const selector = 'div + span ~ li + b ~ c + d';
            expect(translate(selector)).to.eq(
                `A '<d>' element directly adjacent sibling to a '<c>' element after a sibling which is a '<b>' element directly adjacent sibling to an '<li>' element after a sibling which is a '<span>' element directly adjacent sibling to a '<div>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                { tag: 'div' },
                { tag: 'span' },
                { tag: 'li' },
                { tag: 'b' },
                { tag: 'c' },
                { tag: 'd' },
                { tag: 'd' },
            ]);
        });

        it('a b c d ~ d', function () {
            const selector = 'a b c d ~ d';
            expect(translate(selector)).to.eq(
                `A '<d>' element after a sibling which is a '<d>' element within a '<c>' element within a '<b>' element within an '<a>' element`
            );
            expect(visualize(selector)).to.deep.eq([
                {
                    tag: 'a',
                    children: [{ tag: 'b', children: [{ tag: 'c', children: [{ tag: 'd' }, { tag: 'd' }] }] }],
                },
            ]);
        });
    });

    describe('Errors', function () {
        it('Empty >', function () {
            expect(translate('li >')).to.eq(`Error: You Specified an empty combinator '>'`);
            expect(translate('ul > li >')).to.eq(`Error: You Specified an empty combinator '>'`);
        });
        it('Empty +', function () {
            const selector = 'li +';
            expect(translate(selector)).to.eq(`Error: You Specified an empty combinator '+'`);
        });
        it('Empty ~', function () {
            const selector = 'li ~';
            expect(translate(selector)).to.eq(`Error: You Specified an empty combinator '~'`);
        });
    });
});
