import { expect } from 'chai';
import { translate } from '../translate';

describe('Relationships', () => {
    it('Space combinator', function () {
        const selector = 'ul li';
        expect(translate(selector), selector).to.eq(`An '<li>' element within a '<ul>' element`);
    });

    it('Direct child (>)', function () {
        const selector = 'ul > li';
        expect(translate(selector), selector).to.eq(`An '<li>' element directly within a '<ul>' element`);
    });

    it('Directly adjacent (+)', function () {
        const selector = 'li + li';
        expect(translate(selector), selector).to.eq(`An '<li>' element directly adjacent to an '<li>' element`);
    });

    it('Subsequent-sibling (~)', function () {
        const selector = 'li ~ li';
        expect(translate(selector), selector).to.eq(`An '<li>' element after a sibling which is an '<li>' element`);
    });
});
