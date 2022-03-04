import { expect } from 'chai';
import { translate } from '../translate/translate';
import { visualize } from '../ui/visualization/visualize';

describe('Elements', () => {
    it('Any element', function () {
        const selector = '*';
        expect(translate(selector)).to.eq(`Any element`);
        // TODO: Visualization
        // expect(visualize(selector)).to.deep.eq(['Any element']);
    });
    it('A single element (not vowel)', function () {
        const selector = 'p';
        expect(translate(selector)).to.eq(`A '<p>' element`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'p' }]);
    });

    it('A single element (vowel)', function () {
        const selector = 'a';
        expect(translate(selector)).to.eq(`An '<a>' element`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'a' }]);
    });
});
