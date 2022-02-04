import { expect } from 'chai';
import { translate } from '../translate';

describe('Ids', () => {
    it('A single id', function () {
        expect(translate('#a')).to.eq(`An element with the id of 'a'`);
        expect(translate('#abcde')).to.eq(`An element with the id of 'abcde'`);
    });

    it('2 ids', function () {
        const selector = '#a#b';
        expect(translate(selector), selector).to.eq(`Error: An element cannot have two ids`);
    });

    it('2 separated ids', function () {
        const selector = '#a #b';
        expect(translate(selector), selector).to.eq(
            `An element with the id of 'b' within an element with the id of 'a'`
        );
    });

    it('Id and class', function () {
        const selector = '#a.b';
        expect(translate(selector), selector).to.eq(`An element with the id of 'a' with a class of 'b'`);
    });

    it('Element, id and class', function () {
        const selector = 'div#a.b';
        expect(translate(selector), selector).to.eq(`A '<div>' element with the id of 'a' with a class of 'b'`);
    });
});
