import { expect } from 'chai';
import { translate } from '../translate';

describe('Elements', () => {
    it('Any element', function () {
        const selector = '*';
        expect(translate(selector), selector).to.eq(`Any element`);
    });
    it('A single element (not vowel)', function () {
        const selector = 'p';
        expect(translate(selector), selector).to.eq(`A '<p>' element`);
    });

    it('A single element (vowel)', function () {
        const selector = 'a';
        expect(translate(selector), selector).to.eq(`An '<a>' element`);
    });
});
