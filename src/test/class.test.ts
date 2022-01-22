import { expect } from 'chai';
import { translate } from '../translate';

describe('Classes', () => {
    it('A single class selector', function () {
        const selector = '.a';
        expect(translate(selector), selector).to.eq(`An element with a class of 'a'`);
    });
    it('A double class selector', function () {
        const selector = '.a.b';
        expect(translate(selector), selector).to.eq(`An element with classes 'a' and 'b'`);
    });

    it('Multiple class selector', function () {
        const selector = '.a.b.c';
        expect(translate(selector), selector).to.eq(`An element with classes 'a', 'b' and 'c'`);
    });

    it('2 Separate class selectors', function () {
        const selector = '.a, .b';
        expect(translate(selector), selector).to.eq(
            `An element with a class of 'a' and an element with a class of 'b'`
        );
    });

    it('3 Separate class selectors', function () {
        const selector = '.a, .b, .c';
        expect(translate(selector), selector).to.eq(
            `An element with a class of 'a', an element with a class of 'b' and an element with a class of 'c'`
        );
    });

    it('element with 2 classes within an element with 2 classes', function () {
        const selector = '.a.c .b.a';
        expect(translate(selector), selector).to.eq(
            `An element with classes 'b' and 'a' within an element with classes 'a' and 'c'`
        );
    });

    describe('With elements', () => {
        it('A single element with one class', function () {
            const selector = 'p.a';
            expect(translate(selector), selector).to.eq(`A '<p>' element with a class of 'a'`);
        });
        it('A single element with 2 classes', function () {
            const selector = 'p.a.b';
            expect(translate(selector), selector).to.eq(`A '<p>' element with classes 'a' and 'b'`);
        });
        it('A single element with multiple classes', function () {
            const selector = 'div.a.b.c';
            expect(translate(selector), selector).to.eq(`A '<div>' element with classes 'a', 'b' and 'c'`);
        });
        it('A single element with multiple classes (vowel prefix)', function () {
            const selector = 'a.a.b.c';
            expect(translate(selector), selector).to.eq(`An '<a>' element with classes 'a', 'b' and 'c'`);
        });
    });

    describe('Omits duplicates', () => {
        it('duplicate classnames', function () {
            const selector = '.a.a';
            expect(translate(selector), selector).to.eq(`An element with a class of 'a'`);
        });
        it('duplicate classnames - with element', function () {
            const selector = 'div.a.a';
            expect(translate(selector), selector).to.eq(`A '<div>' element with a class of 'a'`);
        });
    });
});
