import { expect } from 'chai';
import { translate } from '../translate';

describe('Attributes', () => {
    it('Has attribute', function () {
        const selector = '[href]';
        expect(translate(selector), selector).to.eq(`Any element with an attribute of 'href'`);
    });

    it('Specific element that has an attribute', function () {
        const selector = 'div[href]';
        expect(translate(selector), selector).to.eq(`A '<div>' element with an attribute of 'href'`);
    });

    describe('With double quotes', function () {
        it('Handle invalid attribute selector', function () {
            const selector = '[="z"]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[="z"]'`);
        });

        it('Handles an empty attribute', function () {
            const selector = '[href=""]';
            expect(translate(selector), selector).to.eq(`Any element with an attribute of 'href' whose value is empty`);
        });

        it('Handles attribute = value', function () {
            const selector = '[target="_blank"]';
            expect(translate(selector), selector).to.eq(
                `Any element with an attribute of 'target' whose value is '_blank'`
            );
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[target="_blank"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank'`
            );
        });

        it('Handles element with attribute ^= value', function () {
            const selector = 'a[href^="mailto:"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value starts with 'mailto:'`
            );
        });

        it('Handles element with attribute $= value', function () {
            const selector = 'a[href$=".pdf"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value ends with '.pdf'`
            );
        });

        it('Handles element with attribute |= value', function () {
            const selector = 'a[lang|="en"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'lang' whose value 'en' is included in a hyphen separated list`
            );
        });

        it('Handles element with attribute ~= value', function () {
            const selector = 'a[rel~="noopener"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value 'noopener' is included in a space separated list`
            );
        });

        it('Handles element with attribute *= value', function () {
            const selector = 'a[rel*="noopener"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[rel*="noopener"]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
        });

        it('Handles element with attribute = value, case insensitive', function () {
            const selector = 'a[target="_blank" i]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank' (case insensitive)`
            );
        });
    });

    describe('Without double quotes', function () {
        it('Handle invalid attribute selector - no attribute', function () {
            const selector = '[=z]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[=z]'`);
        });

        it('Handle invalid attribute selector - no value', function () {
            const selector = '[href=]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[href=]'`);
        });

        it('Handle invalid attribute selector - value ends with colon', function () {
            const selector = '[href=mailto:]';
            expect(translate(selector), selector).to.eq(`Error: Invalid attribute selector: '[href=mailto:]'`);
        });

        it('Handles attribute = value', function () {
            const selector = '[target=_blank]';
            expect(translate(selector), selector).to.eq(
                `Any element with an attribute of 'target' whose value is '_blank'`
            );
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[target=_blank]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank'`
            );
        });

        it('Handles element with attribute ^= value', function () {
            const selector = 'a[href^=mailto]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value starts with 'mailto'`
            );
        });

        it('Handles element with attribute $= value', function () {
            const selector = 'a[href$=.pdf]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value ends with '.pdf'`
            );
        });

        it('Handles element with attribute |= value', function () {
            const selector = 'a[lang|=en]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'lang' whose value 'en' is included in a hyphen separated list`
            );
        });

        it('Handles element with attribute ~= value', function () {
            const selector = 'a[rel~=noopener]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value 'noopener' is included in a space separated list`
            );
        });

        it('Handles element with attribute *= value', function () {
            const selector = 'a[rel*=noopener]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
        });

        it('Handles element with attribute = value, case insensitive', function () {
            const selector = 'a[target=_blank i]';
            expect(translate(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank' (case insensitive)`
            );
        });
    });
});
