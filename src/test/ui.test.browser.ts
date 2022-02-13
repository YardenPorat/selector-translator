import { expect } from 'chai';
import { createVisualizationElement } from '../ui/visualization/create-element';
import { visualize } from '../visualize';

describe('Browser tests', function () {
    describe('Pseudo Classes', function () {
        describe('Inputs', function () {
            it('element + disabled', function () {
                const selector = 'input:disabled';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input disabled="true" value="<input disabled=&quot;true&quot; value=&quot;When its disabled&quot;>" type="text" size="46">'
                );
            });

            it('element + required', function () {
                const selector = 'input:required';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input required="true" value="<input required=&quot;true&quot; value=&quot;When its required&quot;>" type="text" size="46">'
                );
            });

            it('element + optional', function () {
                const selector = 'input:optional';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input value="<input value=&quot;When its optional (Not required)&quot;>" type="text" size="45">'
                );
            });

            it('element + valid', function () {
                const selector = 'input:valid';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input value="<input value=&quot;When its valid (Input value)&quot;>" type="text" size="41">'
                );
            });

            it('element + invalid', function () {
                const selector = 'input:invalid';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input type="email" value="<input type=&quot;email&quot; value=&quot;When its invalid&quot;>" size="42">'
                );
            });

            it('element + read-only', function () {
                const selector = 'input:read-only';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input readonly="true" value="<input readonly=&quot;true&quot; value=&quot;When its read-only&quot;>" type="text" size="47">'
                );
            });

            it('input + read-write', function () {
                const selector = 'input:read-write';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input value="<input value=&quot;When its read-write (Without readonly attribute)&quot;>" type="text" size="61">'
                );
            });

            it('element + in-range', function () {
                const selector = 'input:in-range';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input min="5" max="10" value="<input min=&quot;5&quot; max=&quot;10&quot; value=&quot;When its in-range&quot;>" type="text" size="47">'
                );
            });

            it('element + out-of-range', function () {
                const selector = 'input:out-of-range';
                expect(createVisualizationElement(visualize(selector)[0]).outerHTML).to.eq(
                    '<input min="5" max="10" value="<input min=&quot;5&quot; max=&quot;10&quot; value=&quot;When its out-of-range&quot;>" type="text" size="51">'
                );
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
                        expect(createVisualizationElement(element).outerHTML).to.eq(
                            '<li>&lt;li&gt;When its the first of its type in its parent&lt;/li&gt;</li>'
                        );
                    }
                });

                it('li:first-of-type a', function () {
                    const result = visualize('li:first-of-type a');
                    expect(result.length).to.eq(2);
                    expect(createVisualizationElement(result[0]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the first of its type in its parent&lt;/li&gt;<a>&lt;a&gt;</a></li>'
                    );
                    expect(createVisualizationElement(result[1]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the first of its type in its parent&lt;/li&gt;</li>'
                    );
                });
            });

            describe('last-of-type', function () {
                it('li:last-of-type', function () {
                    const result = visualize('li:last-of-type');
                    expect(result.length).to.eq(2);
                    for (const element of result) {
                        expect(createVisualizationElement(element).outerHTML).to.eq(
                            '<li>&lt;li&gt;When its the last of its type in its parent&lt;/li&gt;</li>'
                        );
                    }
                });

                it('li:last-of-type a', function () {
                    const result = visualize('li:last-of-type a');
                    expect(result.length).to.eq(2);
                    expect(createVisualizationElement(result[0]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the last of its type in its parent&lt;/li&gt;</li>'
                    );
                    expect(createVisualizationElement(result[1]).outerHTML).to.eq(
                        '<li>&lt;li&gt;When its the last of its type in its parent&lt;/li&gt;<a>&lt;a&gt;</a></li>'
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
                        expect(result.length).to.eq(3);
                        for (const element of result) {
                            expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                        }
                    });

                    it(`li:${nodeSelector}:even`, function () {
                        const result = visualize(`li:${nodeSelector}(even)`);
                        expect(result.length).to.eq(3);
                        for (const element of result) {
                            expect(createVisualizationElement(element).outerHTML).to.eq('<li>&lt;li&gt;</li>');
                        }
                    });
                }
            });

            describe('Offset and Step', () => {
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
