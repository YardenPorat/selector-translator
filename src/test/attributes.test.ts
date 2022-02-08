import { expect } from 'chai';
import { translate } from '../translate/translate';
// import { visualize } from '../visualize';

describe('Attributes', () => {
    it('Has attribute', function () {
        const selector = '[href]';
        expect(translate(selector), selector).to.eq(`Any element with an attribute of 'href'`);
        // expect(visualize(selector)).to.deep.eq(['<element href>']);
    });

    it('Specific element that has an attribute', function () {
        const selector = 'div[href]';
        expect(translate(selector), selector).to.eq(`A '<div>' element with an attribute of 'href'`);
        // expect(visualize(selector)).to.deep.eq(['<div href>']);
    });

    describe('With double quotes', function () {
        it('Handle invalid attribute selector', function () {
            const selector = '[="z"]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[="z"]'`);
            // No visualization support for invalid attribute selector
        });

        it('Handles an empty attribute', function () {
            const selector = '[href=""]';
            expect(translate(selector), selector).to.eq(`Any element with an attribute of 'href' whose value is empty`);
            // expect(visualize(selector)).to.deep.eq(['<element href="">']);
        });

        it('Handles attribute = value', function () {
            const selector = '[target="_blank"]';
            expect(translate(selector), selector).to.eq(
                `Any element with an attribute of 'target' whose value is '_blank'`
            );
            // expect(visualize(selector)).to.deep.eq(['<element target="_blank">']);
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[target="_blank"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a target="_blank">']);
        });

        it('Handles element with attribute ^= value', function () {
            const selector = 'a[href^="mailto:"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value starts with 'mailto:'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a href="mailto:*">']);
        });

        it('Handles element with attribute $= value', function () {
            const selector = 'a[href$=".pdf"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value ends with '.pdf'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a href="*.pdf">']);
        });

        it('Handles element with attribute |= value', function () {
            const selector = 'a[lang|="en"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'lang' whose value 'en' is included in a hyphen separated list`
            );
            // expect(visualize(selector)).to.deep.eq(['<a lang="*-en-*">']);
        });

        it('Handles element with attribute ~= value', function () {
            const selector = 'a[rel~="noopener"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value 'noopener' is included in a space separated list`
            );
            // expect(visualize(selector)).to.deep.eq(['<a rel="* noopener *">']);
        });

        it('Handles element with attribute *= value', function () {
            const selector = 'a[rel*="noopener"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a rel="*noopener*">']);
        });

        it('Handles element with attribute = value, case insensitive', function () {
            const selector = 'a[target="_blank" i]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank' (case insensitive)`
            );
            // expect(visualize(selector)).to.deep.eq(['<a target="_blank">']);
        });
    });

    describe('Without double quotes', function () {
        it('Handle invalid attribute selector - no attribute', function () {
            const selector = '[=z]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[=z]'`);
            // No visualization support for invalid attribute selector
        });

        it('Handle invalid attribute selector - no value', function () {
            const selector = '[href=]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[href=]'`);
            // No visualization support for invalid attribute selector
        });

        it('Handle invalid attribute selector - value ends with colon', function () {
            const selector = '[href=mailto:]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[href=mailto:]'`);
            // No visualization support for invalid attribute selector
        });

        it('Handles attribute = value', function () {
            const selector = '[target=_blank]';
            expect(translate(selector), selector).to.eq(
                `Any element with an attribute of 'target' whose value is '_blank'`
            );
            // expect(visualize(selector)).to.deep.eq(['<element target="_blank">']);
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[target=_blank]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a target="_blank">']);
        });

        it('Handles element with attribute ^= value', function () {
            const selector = 'a[href^=mailto]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value starts with 'mailto'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a href="mailto*">']);
        });

        it('Handles element with attribute $= value', function () {
            const selector = 'a[href$=.pdf]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value ends with '.pdf'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a href="*.pdf">']);
        });

        it('Handles element with attribute |= value', function () {
            const selector = 'a[lang|=en]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'lang' whose value 'en' is included in a hyphen separated list`
            );
            // expect(visualize(selector)).to.deep.eq(['<a lang="*-en-*">']);
        });

        it('Handles element with attribute ~= value', function () {
            const selector = 'a[rel~=noopener]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value 'noopener' is included in a space separated list`
            );
            // expect(visualize(selector)).to.deep.eq(['<a rel="* noopener *">']);
        });

        it('Handles element with attribute *= value', function () {
            const selector = 'a[rel*=noopener]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
            // expect(visualize(selector)).to.deep.eq(['<a rel="*noopener*">']);
        });

        it('Handles element with attribute = value, case insensitive', function () {
            const selector = 'a[target=_blank i]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank' (case insensitive)`
            );
            // expect(visualize(selector)).to.deep.eq(['<a target="_blank">']);
        });
    });

    describe('Errors', function () {
        it('Empty attribute', function () {
            expect(translate('[]')).to.eq(`Error: Empty attribute selector: '[]'`);
            expect(translate('[ ]')).to.eq(`Error: Empty attribute selector: '[ ]'`);
            // No visualization support for invalid attribute selector
        });
    });
});
