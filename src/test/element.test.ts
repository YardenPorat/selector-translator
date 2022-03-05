import { expect } from 'chai';
import { getTranslation } from './utils/get-translation';
import { visualize } from '../ui/visualization/visualize';

describe('Elements', () => {
    it('Any element', function () {
        const selector = '*';
        expect(getTranslation(selector)).to.eq(`Any element`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div' }, { tag: 'span' }, { tag: 'a' }]);
    });
    it('A single element (not vowel)', function () {
        const selector = 'p';
        expect(getTranslation(selector)).to.eq(`A '<p>' element`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p' }]);
    });

    it('A single element (vowel)', function () {
        const selector = 'a';
        expect(getTranslation(selector)).to.eq(`An '<a>' element`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a' }]);
    });
});
