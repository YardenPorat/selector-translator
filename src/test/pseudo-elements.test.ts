import { expect } from 'chai';
import { translate } from '../translate/translate';

describe('Pseudo Elements', () => {
    describe('Standalone', function () {
        it('::before', function () {
            const selector = '::before';
            expect(translate(selector), selector).to.eq(`The 'before' pseudo-element of any element`);
        });

        it('::after', function () {
            const selector = '::after';
            expect(translate(selector), selector).to.eq(`The 'after' pseudo-element of any element`);
        });

        it('::first-line', function () {
            const selector = '::first-line';
            expect(translate(selector), selector).to.eq(`The first line of any element`);
        });

        it('::first-letter', function () {
            const selector = '::first-letter';
            expect(translate(selector), selector).to.eq(`The first letter of any element`);
        });

        it('::placeholder', function () {
            const selector = '::placeholder';
            expect(translate(selector), selector).to.eq(`The placeholder of any element`);
        });

        it('::marker', function () {
            const selector = '::marker';
            expect(translate(selector), selector).to.eq(`The marker (numbering) of any element`);
        });

        it('::backdrop', function () {
            const selector = '::backdrop';
            expect(translate(selector), selector).to.eq(`The backdrop of any element`);
        });

        it('::selection', function () {
            const selector = '::selection';
            expect(translate(selector), selector).to.eq(`The highlighted selection of any element`);
        });
    });

    describe('With element', function () {
        it('element + ::before', function () {
            const selector = 'a::before';
            expect(translate(selector), selector).to.eq(`The 'before' pseudo-element of an '<a>' element`);
        });
        it('element + ::after', function () {
            const selector = 'a::after';
            expect(translate(selector), selector).to.eq(`The 'after' pseudo-element of an '<a>' element`);
        });

        it('element + ::first-line', function () {
            const selector = 'p::first-line';
            expect(translate(selector), selector).to.eq(`The first line of a '<p>' element`);
        });

        it('element + ::first-letter', function () {
            const selector = 'p::first-letter';
            expect(translate(selector), selector).to.eq(`The first letter of a '<p>' element`);
        });

        it('element + ::placeholder', function () {
            const selector = 'input::placeholder';
            expect(translate(selector), selector).to.eq(`The placeholder of an '<input>' element`);
        });

        it('element + ::marker', function () {
            const selector = 'li::marker';
            expect(translate(selector), selector).to.eq(`The marker (numbering) of an '<li>' element`);
        });

        it('element + ::backdrop', function () {
            const selector = 'dialog::backdrop';
            expect(translate(selector), selector).to.eq(`The backdrop of a '<dialog>' element`);
        });

        it('element + ::selection', function () {
            const selector = 'p::selection';
            expect(translate(selector), selector).to.eq(`The highlighted selection of a '<p>' element`);
        });
    });

    describe('With more complex cases', function () {
        it('element + id + class + ::before', function () {
            const selector = 'div#b.c::before';
            expect(translate(selector), selector).to.eq(
                `The 'before' pseudo-element of a '<div>' element with the id of 'b' with a class of 'c'`
            );
        });

        it('element + id + class + ::before inside an element with id', function () {
            const selector = 'div#a div#b.c::before';
            expect(translate(selector), selector).to.eq(
                `The 'before' pseudo-element of a '<div>' element with the id of 'b' with a class of 'c' within a '<div>' element with the id of 'a'`
            );
        });

        it('element + pseudo class + ::before inside an element', function () {
            const selector = 'input:required::before';
            expect(translate(selector), selector).to.eq(
                `The 'before' pseudo-element of an '<input>' element when its required`
            );
        });
    });

    describe('Errors', function () {
        it('element::abc', function () {
            const selector = 'div::abc';
            expect(translate(selector), selector).to.eq(`Error: Unknown pseudo element 'abc'`);
        });
    });
});
