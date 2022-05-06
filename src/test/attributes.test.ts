import { expect } from 'chai';
import { getTranslation } from './utils/get-translation';
import { visualize } from '../ui/visualization/visualize';

describe('Attributes', () => {
    describe('Without value', function () {
        it('Has attribute - [href]', function () {
            const selector = '[href]';
            expect(getTranslation(selector)).to.eq(`Any element with an attribute of 'href'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', attributes: { href: '' } }]);
        });

        it('Specific element that has an attribute', function () {
            const selector = 'div[href]';
            expect(getTranslation(selector)).to.eq(`A '<div>' element with an attribute of 'href'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', attributes: { href: '' } }]);
        });
    });

    describe('With double quotes', function () {
        it('Handle invalid attribute selector', function () {
            const selector = '[="z"]';
            expect(getTranslation(selector)).to.eq(`Error: Invalid attribute selector: '[="z"]'`);
            // No visualization support for invalid attribute selector
        });

        it('Handles an empty attribute', function () {
            const selector = '[href=""]';
            expect(getTranslation(selector), selector).to.eq(
                `Any element with an attribute of 'href' whose value is empty`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', attributes: { href: '' } }]);
        });

        it('Handles attribute = value', function () {
            const selector = '[target="_blank"]';
            expect(getTranslation(selector), selector).to.eq(
                `Any element with an attribute of 'target' whose value is '_blank'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', attributes: { target: '_blank' } }]);
        });

        it('Handles attribute with numeric value', function () {
            const selector = '[a="1"]';
            expect(getTranslation(selector), selector).to.eq(`Any element with an attribute of 'a' whose value is '1'`);
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', attributes: { a: '1' } }]);
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[target="_blank"]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { target: '_blank' } }]);
        });

        it('Handles element with attribute ^= value', function () {
            const selector = 'a[href^="mailto:"]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value starts with 'mailto:'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { href: 'mailto:*' } }]);
        });

        it('Handles element with attribute $= value', function () {
            const selector = 'a[href$=".pdf"]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value ends with '.pdf'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { href: '*.pdf' } }]);
        });

        it(`Handles element with attribute |= value - 'a[lang|="en"]'`, function () {
            const selector = 'a[lang|="en"]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'lang' whose value 'en' is included in a hyphen separated list`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { lang: '*-en-*' } }]);
        });

        it('Handles element with attribute ~= value', function () {
            const selector = 'a[rel~="noopener"]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value 'noopener' is included in a space separated list`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { rel: '* noopener *' } }]);
        });

        it('Handles element with attribute *= value', function () {
            const selector = 'a[rel*="noopener"]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { rel: '*noopener*' } }]);
        });

        it('Handles element with attribute = value, case insensitive', function () {
            const selector = 'a[target="_blank" i]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank' (case insensitive)`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { target: '_bLaNk' } }]);
        });
    });

    describe('Without double quotes', function () {
        it('Handles attribute = value', function () {
            const selector = '[target=_blank]';
            expect(getTranslation(selector), selector).to.eq(
                `Any element with an attribute of 'target' whose value is '_blank'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'div', attributes: { target: '_blank' } }]);
        });

        it('Handles element with attribute = value', function () {
            const selector = 'a[target=_blank]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { target: '_blank' } }]);
        });

        it('Handles element with attribute ^= value', function () {
            const selector = 'a[href^=mailto]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value starts with 'mailto'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { href: 'mailto*' } }]);
        });

        it('Handles element with attribute $= value', function () {
            const selector = 'a[href$=.pdf]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'href' whose value ends with '.pdf'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { href: '*.pdf' } }]);
        });

        it('Handles element with attribute |= value', function () {
            const selector = 'a[lang|=en]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'lang' whose value 'en' is included in a hyphen separated list`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { lang: '*-en-*' } }]);
        });

        it('Handles element with attribute ~= value', function () {
            const selector = 'a[rel~=noopener]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value 'noopener' is included in a space separated list`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { rel: '* noopener *' } }]);
        });

        it('Handles element with attribute *= value', function () {
            const selector = 'a[rel*=noopener]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'rel' whose value contains 'noopener'`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { rel: '*noopener*' } }]);
        });

        it('Handles element with attribute = value, case insensitive', function () {
            const selector = 'a[target=_blank i]';
            expect(getTranslation(selector), selector).to.eq(
                `An '<a>' element with an attribute of 'target' whose value is '_blank' (case insensitive)`
            );
            expect(visualize(selector)).to.deep.eq([{ tag: 'a', attributes: { target: '_bLaNk' } }]);
        });

        describe('Invalid selectors', function () {
            // No visualization support for invalid attribute selector
            it('Handle invalid attribute selector - no attribute', function () {
                const selector = '[=z]';
                expect(getTranslation(selector), selector).to.eq(`Error: Invalid attribute selector: '[=z]'`);
            });

            it('Handle invalid attribute selector - no value', function () {
                const selector = '[href=]';
                expect(getTranslation(selector), selector).to.eq(`Error: Invalid attribute selector: '[href=]'`);
            });

            it('Handle invalid attribute selector - value ends with colon', function () {
                const selector = '[href=mailto:]';
                expect(getTranslation(selector), selector).to.eq(`Error: Invalid attribute selector: '[href=mailto:]'`);
            });

            it('Handle invalid value which must be wrapped with double quotes', function () {
                const selector = '[a=1]';
                expect(getTranslation(selector), selector).to.eq(
                    `Error: Numeric attribute value which is not wrapped in double quotes - 1`
                );
            });
        });
    });

    describe('Errors', function () {
        // No visualization support for invalid attribute selector
        it('Empty attribute', function () {
            expect(getTranslation('[]')).to.eq(`Error: Empty attribute selector: '[]'`);
            expect(getTranslation('[ ]')).to.eq(`Error: Empty attribute selector: '[ ]'`);
        });

        it('Missing ending bracket', function () {
            expect(getTranslation('[a="b"')).to.eq(`Error: Invalid input - '[a="b"'`);
        });

        it('Missing ending quote', function () {
            expect(getTranslation('[a="b')).to.eq(`Error: Invalid input - '[a="b'`);
        });
    });
});
