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
});
