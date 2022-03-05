import { expect } from 'chai';
import { getTranslation } from './utils/get-translation';
import { visualize } from '../ui/visualization/visualize';

describe('Classes', () => {
    it('A single class selector', function () {
        const selector = '.a';
        expect(getTranslation(selector)).to.eq(`An element with a class of 'a'`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div', classes: ['a'] }]);
    });
    it('A double class selector', function () {
        const selector = '.a.b';
        expect(getTranslation(selector)).to.eq(`An element with classes 'a' and 'b'`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div', classes: ['a', 'b'] }]);
    });

    it('Multiple class selector', function () {
        const selector = '.a.b.c';
        expect(getTranslation(selector), selector).to.eq(`An element with classes 'a', 'b' and 'c'`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div', classes: ['a', 'b', 'c'] }]);
    });

    it('2 Separate class selectors', function () {
        const selector = '.a, .b';
        expect(getTranslation(selector)).to.eq(`An element with a class of 'a' and an element with a class of 'b'`);
        // No visualization support for multiple selectors
    });

    it('3 Separate class selectors', function () {
        const selector = '.a, .b, .c';
        expect(getTranslation(selector)).to.eq(
            `An element with a class of 'a', an element with a class of 'b' and an element with a class of 'c'`
        );
        // No visualization support for multiple selectors
    });

    it('element with 2 classes within an element with 2 classes', function () {
        const selector = '.a.c .b.a';
        expect(getTranslation(selector)).to.eq(
            `An element with classes 'b' and 'a' within an element with classes 'a' and 'c'`
        );
        expect(visualize(selector)).to.deep.eq([
            { tag: 'div', classes: ['a', 'c'], children: [{ tag: 'div', classes: ['b', 'a'] }] },
        ]);
    });

    describe('With elements', () => {
        it('A single element with one class', function () {
            const selector = 'p.a';
            expect(getTranslation(selector)).to.eq(`A '<p>' element with a class of 'a'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'p', classes: ['a'] }]);
        });
        it('A single element with 2 classes', function () {
            const selector = 'p.a.b';
            expect(getTranslation(selector), selector).to.eq(`A '<p>' element with classes 'a' and 'b'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'p', classes: ['a', 'b'] }]);
        });
        it('A single element with multiple classes', function () {
            const selector = 'div.a.b.c';
            expect(getTranslation(selector), selector).to.eq(`A '<div>' element with classes 'a', 'b' and 'c'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', classes: ['a', 'b', 'c'] }]);
        });

        it('A single element with multiple classes (vowel prefix)', function () {
            const selector = 'a.a.b.c';
            expect(getTranslation(selector)).to.eq(`An '<a>' element with classes 'a', 'b' and 'c'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', classes: ['a', 'b', 'c'] }]);
        });
    });

    describe('Omits duplicates', () => {
        it('duplicate classnames', function () {
            const selector = '.a.a';
            expect(getTranslation(selector), selector).to.eq(`An element with a class of 'a'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', classes: ['a'] }]);
        });
        it('duplicate classnames - with element', function () {
            const selector = 'div.a.a';
            expect(getTranslation(selector), selector).to.eq(`A '<div>' element with a class of 'a'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', classes: ['a'] }]);
        });
    });

    describe('Errors', () => {
        // No visualizations on errors
        it('Missing class', function () {
            const selector = 'div.';
            expect(getTranslation(selector), selector).to.eq(`Error: You specified an empty class`);
        });
    });
});
