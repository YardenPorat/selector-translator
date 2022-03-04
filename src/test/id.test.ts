import { expect } from 'chai';
import { translate } from '../translate/translate';
import { visualize } from '../ui/visualization/visualize';

describe('Ids', () => {
    it('A single id', function () {
        expect(translate('#a')).to.eq(`An element with the id of 'a'`);
        expect(visualize('#a')).to.deep.eq([{ tag: 'div', id: 'a' }]);

        expect(translate('#abcde')).to.eq(`An element with the id of 'abcde'`);
        expect(visualize('#abcde')).to.deep.eq([{ tag: 'div', id: 'abcde' }]);
    });

    it('id within id', function () {
        const selector = '#a #b';
        expect(translate(selector)).to.eq(`An element with the id of 'b' within an element with the id of 'a'`);
        expect(visualize(selector)).to.deep.eq([{ tag: 'div', id: 'a', children: [{ tag: 'div', id: 'b' }] }]);
    });

    it('Id and class', function () {
        const selector = '#a.b';
        expect(translate(selector), selector).to.eq(`An element with the id of 'a' with a class of 'b'`);
        expect(visualize(selector)).to.deep.eq([{ classes: ['b'], id: 'a', tag: 'div' }]);
    });

    it('Element + id + class', function () {
        const selector = 'span#a.b';
        expect(translate(selector), selector).to.eq(`A '<span>' element with the id of 'a' with a class of 'b'`);
        expect(visualize(selector)).to.deep.eq([{ classes: ['b'], id: 'a', tag: 'span' }]);
    });

    describe('Errors', function () {
        // No visualization on errors
        it('Empty id', function () {
            const selector = 'div#';
            expect(translate(selector), selector).to.eq(`Error: You specified an empty id`);
        });

        it('2 ids', function () {
            const selector = '#a#b';
            expect(translate(selector), selector).to.eq(`Error: An element cannot have two ids`);
        });
    });
});
