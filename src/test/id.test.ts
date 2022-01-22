import { expect } from 'chai';
import { translate } from '../translate';

describe('Ids', () => {
    it('A single id', function () {
        const selector = '#a';
        expect(translate(selector), selector).to.eq(`An element with id of 'a'`);
    });
});
