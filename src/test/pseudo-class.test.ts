import { expect } from 'chai';
import { translate } from '../translate';

describe('Pseudo Class', () => {
    it('element + hover', function () {
        const selector = 'a:hover';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its hovered`);
    });

    it('element + active', function () {
        const selector = 'a:active';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its active`);
    });

    it('element + focus', function () {
        const selector = 'a:focus';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its focused`);
    });

    it('element + visited', function () {
        const selector = 'a:visited';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its visited`);
    });

    it('element + empty', function () {
        const selector = 'p:empty';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its empty`);
    });

    it('element + blank', function () {
        const selector = 'p:blank';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its blank`);
    });

    it('element + target', function () {
        const selector = 'p:target';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its targeted`);
    });

    it('element + lang(en)', function () {
        const selector = 'p:lang(en)';
        expect(translate(selector), selector).to.eq(`A '<p>' element when its language is 'en'`);
    });

    it('element + checked', function () {
        const selector = 'input:checked';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its checked`);
    });

    it('element + indeterminate', function () {
        const selector = 'input:indeterminate';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its indeterminate`);
    });

    it('element + disabled', function () {
        const selector = 'input:disabled';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its disabled`);
    });

    it('element + disabled', function () {
        const selector = 'input:disabled';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its disabled`);
    });

    it('element + optional', function () {
        const selector = 'input:optional';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its optional`);
    });

    it('element + valid', function () {
        const selector = 'input:valid';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its valid`);
    });

    it('element + invalid', function () {
        const selector = 'input:invalid';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its invalid`);
    });

    it('element + required', function () {
        const selector = 'input:required';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its required`);
    });

    it('element + read-only', function () {
        const selector = 'input:read-only';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its read-only`);
    });

    it('element + read-write', function () {
        const selector = 'input:read-write';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its read-write`);
    });

    it('element + in-range', function () {
        const selector = 'input:in-range';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its in-range`);
    });

    it('element + out-of-range', function () {
        const selector = 'input:out-of-range';
        expect(translate(selector), selector).to.eq(`An '<input>' element when its out-of-range`);
    });

    it('element + last-child', function () {
        const selector = 'li:last-child';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the last child of its parent`);
    });

    it('element + first-child', function () {
        const selector = 'li:first-child';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the first child of its parent`);
    });

    it('element + only-child', function () {
        const selector = 'li:only-child';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the only child of its parent`);
    });

    it('element + nth-child', function () {
        const selector = 'li:nth-child(3)';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the nth child (formula) of its parent`);
    });

    it('element + nth-last-child', function () {
        const selector = 'li:nth-last-child(3)';
        expect(translate(selector), selector).to.eq(
            `An '<li>' element when its the nth (formula) child from the end of its parent`
        );
    });

    it('element + first-of-type', function () {
        const selector = 'li:first-of-type';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the first of its type in its parent`);
    });

    it('element + last-of-type', function () {
        const selector = 'li:last-of-type';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the last of its type in its parent`);
    });

    it('element + only-of-type', function () {
        const selector = 'li:only-of-type';
        expect(translate(selector), selector).to.eq(`An '<li>' element when its the only of its type in its parent`);
    });

    it('element + nth-of-type', function () {
        const selector = 'li:nth-of-type';
        expect(translate(selector), selector).to.eq(
            `An '<li>' element when its the nth (formula) of its type in its parent`
        );
    });

    it('element + nth-last-of-type', function () {
        const selector = 'li:nth-last-of-type';
        expect(translate(selector), selector).to.eq(
            `An '<li>' element when its the nth (formula) of its type in its parent, from the end`
        );
    });

    it('element + Multiple pseudo classes', function () {
        const selector = 'a:active:hover';
        expect(translate(selector), selector).to.eq(`An '<a>' element when its active and hovered`);
    });

    it('element + + class Multiple pseudo classes', function () {
        const selector = 'ul.phone_numbers li:last-child:hover';
        expect(translate(selector), selector).to.eq(
            `An '<li>' element when its the last child of its parent and hovered within a '<ul>' element with a class of 'phone_numbers'`
        );
    });

    it('Unknown pseudo-class', function () {
        const selector = 'div:a';
        expect(translate(selector), selector).to.eq(`A '<div>' element when its when it is 'a' (unknown pseudo class)`);
    });

    describe('Errors', () => {
        it('Missing pseudo-class', function () {
            const selector = 'div:';
            expect(translate(selector), selector).to.eq(`Error: You specified an empty pseudo class`);
        });

        it('Pseudo-class which is suppose to be a pseudo element', function () {
            const selector = 'div:after';
            expect(translate(selector), selector).to.eq(
                `Error: You specified a pseudo element (after) as a pseudo class`
            );
        });
    });
});
