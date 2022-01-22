import { expect } from 'chai';
import { translate } from '../translate';
import { classes } from './class';
import { elements } from './element';
import { ids } from './id';

export interface TestCase {
    name: string;
    selector: string;
    result: string;
}

const cases: Record<string, TestCase[]> = {
    // elements, classes,
    ids,
};

describe('Selectors', function () {
    for (const [suiteName, tests] of Object.entries(cases)) {
        describe(suiteName, () => {
            for (const { name, result, selector } of tests) {
                it(`${name} (${selector})`, () => {
                    expect(translate(selector)).to.eq(result);
                });
            }
        });
    }
});
