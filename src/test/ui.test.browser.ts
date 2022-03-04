import { expect } from 'chai';
import { createVisualizationElement } from '../ui/visualization/create-element';
import { visualize } from '../ui/visualization/visualize';

const visualizeTextArea = (selector: string) =>
    createVisualizationElement(visualize(selector)[0]) as HTMLTextAreaElement;
const getVisualizedElements = (selector: string) => visualize(selector).map((item) => createVisualizationElement(item));
const getChildByIndex = (el: HTMLElement, index: number) => el.children[index] as HTMLElement;
const getFirstNodeValue = (el: HTMLElement) => el.firstChild?.nodeValue;

describe('Browser tests', function () {
    describe('Elements', function () {
        describe('Tags', function () {
            describe('textarea', function () {
                it('textarea', function () {
                    const selector = 'textarea';
                    const element = visualizeTextArea(selector);
                    expect(element.tagName).to.eq('TEXTAREA');
                    expect(element.cols).to.eq(9);
                    expect(element.value).to.eq('<textarea>');
                    expect(element.spellcheck).to.eq(false);
                });
                it('textarea + focus', function () {
                    const selector = 'textarea:focus';
                    const element = visualizeTextArea(selector);
                    expect(element.tagName).to.eq('TEXTAREA');
                    expect(element.cols).to.eq(59);
                    expect(element.value).to.eq('<textarea>When its focused (Use with input / textarea)</textarea>');
                    expect(element.spellcheck).to.eq(false);
                });
            });
        });
    });
    describe('Universal', function () {
        describe('*', function () {
            it('*', function () {
                const selector = '*';
                const visualizations = visualize(selector);
                expect(visualizations.length).to.eq(3);
                expect(createVisualizationElement(visualizations[0]).innerText).to.eq('<div>');
                expect(createVisualizationElement(visualizations[1]).innerText).to.eq('<span>');
                expect(createVisualizationElement(visualizations[2]).innerText).to.eq('<a>');
            });

            it('span + *', function () {
                const selector = 'span + *';
                const visualizations = visualize(selector);
                expect(visualizations.length).to.eq(5);
                expect(visualizations.map((item) => createVisualizationElement(item).innerText)).to.deep.eq([
                    '<span>',
                    '<div>',
                    '<div>',
                    '<span>',
                    '<a>',
                ]);
            });

            it('span + * footer', function () {
                const selector = 'span + * footer';
                const visualizations = visualize(selector);
                expect(visualizations.length).to.eq(5);
                expect(visualizations.map((item) => createVisualizationElement(item).innerText)).to.deep.eq([
                    '<span>',
                    '<div><footer>',
                    '<div><footer>',
                    '<span>',
                    '<a>',
                ]);
            });
        });
    });
    describe('Relationship Combinators', function () {
        describe('Subsequent-sibling (~)', function () {
            it('li ~ li', function () {
                const selector = 'li ~ li';
                const elements = getVisualizedElements(selector);
                expect(elements[0].innerText).to.eq('<li>');
                expect(elements[1].innerText).to.eq('<li>');
            });

            it('a ~ a ~ a ~ a ~ a', function () {
                const selector = 'a ~ a ~ a ~ a ~ a';
                const elements = getVisualizedElements(selector);
                expect(elements.map((el) => el.innerText)).to.deep.eq(['<a>', '<a>', '<a>', '<a>', '<a>']);
            });

            it('a ~ b ~ c ~ d ~ e', function () {
                const selector = 'a ~ b ~ c ~ d ~ e';
                const elements = getVisualizedElements(selector);
                expect(elements.map((el) => el.innerText)).to.deep.eq(['<a>', '<b>', '<c>', '<d>', '<e>']);
            });

            it('div span ~ li', function () {
                const selector = 'div span ~ li';
                const elements = getVisualizedElements(selector);
                expect(elements[0].childElementCount).to.eq(2);
                expect(elements[0].firstChild?.nodeValue).to.eq('<div>');
                expect((elements[0].firstElementChild as HTMLElement).innerText).to.eq('<span>');
                expect((elements[0].lastElementChild as HTMLElement).innerText).to.eq('<li>');
            });

            it('div + span ~ li', function () {
                const selector = 'div + span ~ li';
                const elements = getVisualizedElements(selector);
                expect(elements.map((el) => el.innerText)).to.deep.eq(['<div>', '<span>', '<span>', '<li>']);
            });

            it('div + span ~ li + b ~ c + d', function () {
                const selector = 'div + span ~ li + b ~ c + d';
                const elements = getVisualizedElements(selector);
                expect(elements.map((el) => el.innerText)).to.deep.eq([
                    '<div>',
                    '<span>',
                    '<li>',
                    '<b>',
                    '<c>',
                    '<d>',
                    '<d>',
                ]);
            });

            it('a b c d ~ d', function () {
                const selector = 'a b c d ~ d';
                const elements = getVisualizedElements(selector);
                expect(elements[0].firstChild?.nodeValue).to.deep.eq('<a>');
                expect(elements[0].firstElementChild?.firstChild?.nodeValue).to.deep.eq('<b>');
                expect(elements[0].firstElementChild?.firstElementChild?.firstChild?.nodeValue).to.deep.eq('<c>');
                expect(
                    elements[0].firstElementChild?.firstElementChild?.firstElementChild?.firstChild?.nodeValue
                ).to.deep.eq('<d>');
                expect(
                    (
                        elements[0].firstElementChild?.firstElementChild?.firstElementChild
                            ?.nextElementSibling as HTMLElement
                    ).innerText
                ).to.deep.eq('<d>');
            });
            it('a b c > d ~ d ~ d', function () {
                const selector = 'a b c > d ~ d ~ d';
                const elements = getVisualizedElements(selector);
                expect(elements[0].firstChild?.nodeValue).to.deep.eq('<a>');
                expect(elements[0].firstElementChild?.firstChild?.nodeValue).to.deep.eq('<b>');
                expect(elements[0].firstElementChild?.firstElementChild?.firstChild?.nodeValue).to.deep.eq('<c>');
                expect(
                    (elements[0].firstElementChild?.firstElementChild?.firstElementChild as HTMLElement).innerText
                ).to.deep.eq('<d><d>');
                expect(
                    (
                        elements[0].firstElementChild?.firstElementChild?.firstElementChild
                            ?.nextElementSibling as HTMLElement
                    ).innerText
                ).to.deep.eq('<d>');
                expect(
                    (
                        elements[0].firstElementChild?.firstElementChild?.firstElementChild?.nextElementSibling
                            ?.nextElementSibling as HTMLElement
                    ).innerText
                ).to.deep.eq('<d>');
            });
        });
    });
    describe('Pseudo Elements', function () {
        it('::first-line', function () {
            const selector = '::first-line';
            const elements = getVisualizedElements(selector);
            expect(elements.length).to.eq(2);
            const firstEl = elements[0];
            expect(getFirstNodeValue(firstEl)).to.eq('<div>');
            expect(getChildByIndex(firstEl, 0).innerText).to.eq('First line');
            expect(getChildByIndex(firstEl, 1).innerText).to.eq('Second line');
            expect(getFirstNodeValue(elements[1])).to.eq('</div>');
        });

        it('div + nth-child(2) + ::first-line', function () {
            const selector = 'div:nth-child(2)::first-line';
            const elements = getVisualizedElements(selector);
            expect(elements.length).to.eq(4);
            expect(elements[0]).to.deep.include({ innerText: '<div>', childElementCount: 0 });

            expect(elements[1]).to.deep.include({ childElementCount: 2 });
            expect(getFirstNodeValue(elements[1])).to.eq('<div>');
            expect(getChildByIndex(elements[1], 0).innerText).to.eq('First line');
            expect(getChildByIndex(elements[1], 1).innerText).to.eq('Second line');

            expect(elements[2]).to.deep.include({ innerText: '</div>', childElementCount: 0 });
            expect(elements[3]).to.deep.include({ innerText: '<div>', childElementCount: 0 });
        });
    });
    describe('Pseudo Classes', function () {
        describe('Inputs', function () {
            it('element + disabled', function () {
                const selector = 'input:disabled';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.disabled).to.eq(true);
                expect(element.size).to.eq(44);
                expect(element.value).to.eq('<input disabled="true" value="When its disabled">');
            });

            it('input + required', function () {
                const selector = 'input:required';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.required).to.eq(true);
                expect(element.size).to.eq(43);
                expect(element.value).to.eq('<input required="true" value="When its required">');
            });

            it('input + optional', function () {
                const selector = 'input:optional';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.size).to.eq(43);
                expect(element.value).to.eq('<input value="When its optional (Not required)">');
            });

            it('input + valid', function () {
                const selector = 'input:valid';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.size).to.eq(40);
                expect(element.value).to.eq('<input value="When its valid (Input value)">');
            });

            it('input + invalid', function () {
                const selector = 'input:invalid';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('email');
                expect(element.size).to.eq(40);
                expect(element.value).to.eq('<input type="email" value="When its invalid">');
            });

            it('input + read-only', function () {
                const selector = 'input:read-only';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.size).to.eq(45);
                expect(element.readOnly).to.eq(true);
                expect(element.value).to.eq('<input readonly="true" value="When its read-only">');
            });

            it('input + read-write', function () {
                const selector = 'input:read-write';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.size).to.eq(57);
                expect(element.value).to.eq('<input value="When its read-write (Without readonly attribute)">');
            });

            it('input + in-range', function () {
                const selector = 'input:in-range';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.min).to.eq('5');
                expect(element.max).to.eq('10');
                expect(element.size).to.eq(45);
                expect(element.value).to.eq('<input min="5" max="10" value="When its in-range">');
            });

            it('input + out-of-range', function () {
                const selector = 'input:out-of-range';
                const element = createVisualizationElement(visualize(selector)[0]) as HTMLInputElement;
                expect(element.type).to.eq('text');
                expect(element.min).to.eq('5');
                expect(element.max).to.eq('10');
                expect(element.size).to.eq(49);
                expect(element.value).to.eq('<input min="5" max="10" value="When its out-of-range">');
            });
        });

        describe('Generic element', function () {
            it('div:read-only', function () {
                const selector = 'div:read-only';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<div readonly="true">&lt;div readonly="true"&gt;When its read-only&lt;/div&gt;</div>'
                );
            });
            it('div:read-write', function () {
                const selector = 'div:read-write';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<div>&lt;div&gt;When its read-write (Without readonly attribute)&lt;/div&gt;</div>'
                );
            });

            it('li:only-child', function () {
                const selector = 'li:only-child';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<li>&lt;li&gt;When its the only child of its parent&lt;/li&gt;</li>'
                );
            });

            it('li:only-of-type', function () {
                const selector = 'li:only-of-type';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<li>&lt;li&gt;When its the only of its type in its parent&lt;/li&gt;</li>'
                );
            });

            it('a:active:hover', function () {
                const selector = 'a:active:hover';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<a>&lt;a&gt;When its active (Click on me!) and hovered&lt;/a&gt;</a>'
                );
            });

            it('element.class + element:Multiple pseudo classes', function () {
                const selector = 'ul.phone_numbers li:last-child:hover';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<ul class="phone_numbers">&lt;ul class="phone_numbers"&gt;<li>&lt;li&gt;When its the last child of its parent&lt;/li&gt;</li><li>&lt;li&gt;When its the last child of its parent and hovered&lt;/li&gt;</li></ul>'
                );
            });

            describe('first-child', function () {
                it('li:last-child', function () {
                    const result = visualize('li:last-child');
                    expect(result.length).to.eq(2);
                    for (const element of result) {
                        expect(createVisualizationElement(element).outerHTML).to.eq(
                            '<li>&lt;li&gt;When its the last child of its parent&lt;/li&gt;</li>'
                        );
                    }
                });

                it('li:last-child a', function () {
                    const result = visualize('li:last-child a');
                    expect(result.length).to.eq(2);
                    expect(createVisualizationElement(result[0]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the last child of its parent&lt;/li&gt;</li>'
                    );
                    expect(createVisualizationElement(result[1]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the last child of its parent&lt;/li&gt;<a>&lt;a&gt;</a></li>'
                    );
                });
            });

            describe('first-child', function () {
                it('li:first-child', function () {
                    const result = visualize('li:first-child');
                    expect(result.length).to.eq(2);
                    for (const element of result) {
                        expect(createVisualizationElement(element).outerHTML).to.eq(
                            '<li>&lt;li&gt;When its the first child of its parent&lt;/li&gt;</li>'
                        );
                    }
                });

                it('li:first-child a', function () {
                    const result = visualize('li:first-child a');
                    expect(result.length).to.eq(2);
                    expect(createVisualizationElement(result[0]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the first child of its parent&lt;/li&gt;<a>&lt;a&gt;</a></li>'
                    );
                    expect(createVisualizationElement(result[1]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the first child of its parent&lt;/li&gt;</li>'
                    );
                });
            });

            describe('first-of-type', function () {
                it('li:first-of-type', function () {
                    const result = visualize('li:first-of-type');
                    expect(result.length).to.eq(2);
                    for (const element of result) {
                        const el = createVisualizationElement(element);
                        expect(el.textContent).to.eq('<li>When its the first child of its type in its parent</li>');
                        expect(el.tagName).to.eq('LI');
                    }
                });

                it('li:first-of-type a', function () {
                    const result = visualize('li:first-of-type a');
                    expect(result.length).to.eq(2);
                    expect(createVisualizationElement(result[0]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the first child of its type in its parent&lt;/li&gt;<a>&lt;a&gt;</a></li>'
                    );
                    expect(createVisualizationElement(result[1]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the first child of its type in its parent&lt;/li&gt;</li>'
                    );
                });
            });

            describe('last-of-type', function () {
                it('li:last-of-type', function () {
                    const result = visualize('li:last-of-type');
                    expect(result.length).to.eq(2);
                    for (const element of result) {
                        expect(createVisualizationElement(element).outerHTML).to.eq(
                            '<li>&lt;li&gt;When its the last child of its type in its parent&lt;/li&gt;</li>'
                        );
                    }
                });

                it('li:last-of-type a', function () {
                    const result = visualize('li:last-of-type a');
                    expect(result.length).to.eq(2);
                    expect(createVisualizationElement(result[0]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the last child of its type in its parent&lt;/li&gt;</li>'
                    );
                    expect(createVisualizationElement(result[1]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the last child of its type in its parent&lt;/li&gt;<a>&lt;a&gt;</a></li>'
                    );
                });
            });
        });

        describe('Formulas', function () {
            describe('Offset only', function () {
                for (const selector of ['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type']) {
                    for (const n of [1, 3, 30]) {
                        it(`li:${selector}(${n})`, function () {
                            const result = visualize(`li:${selector}(${n})`);
                            expect(result.length).to.eq(n + 1);
                            for (const element of result) {
                                expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                            }
                        });
                    }
                }
            });

            describe('Offset and Step', () => {
                for (const nodeSelector of ['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type']) {
                    for (const offsetAndStep of ['n+3', '-n+3', '-2n+3', '-2n+4', '3n+5']) {
                        it(`li:${nodeSelector}(${offsetAndStep})`, function () {
                            const selector = `li:${nodeSelector}(${offsetAndStep})`;
                            const n = Number(offsetAndStep.at(-1));
                            const result = visualize(selector);
                            expect(result.length).to.eq(n * 2 + 1);
                            for (const element of result) {
                                expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                            }
                        });
                    }

                    it(`li:${nodeSelector}:odd`, function () {
                        const result = visualize('li:nth-child(odd)');
                        expect(result.length).to.eq(5);
                        for (const element of result) {
                            expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                        }
                    });

                    it(`li:${nodeSelector}:even`, function () {
                        const result = visualize(`li:${nodeSelector}(even)`);
                        expect(result.length).to.eq(5);
                        for (const element of result) {
                            expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                        }
                    });
                }
            });

            describe('Step', () => {
                for (const nodeSelector of ['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type']) {
                    for (const step of ['2n']) {
                        it(`element + ${nodeSelector}(${step})`, function () {
                            const selector = `li:${nodeSelector}(${step})`;
                            const n = Number(step[0]);
                            const result = visualize(selector);
                            expect(result.length).to.eq(n * 2 + 1);
                            for (const element of result) {
                                expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                            }
                        });
                    }
                }
            });
        });
    });
});
