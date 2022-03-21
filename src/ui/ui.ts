import { visualize } from './visualization/visualize';
import { translate } from '../translate/translate';
import { createVisualizationElement, getVisualizationStyle } from './visualization/create-element';
import './style.css';
import type { Specificity } from '@tokey/css-selector-parser';

const visualizationSelector = '#visualization';

export class App {
    private input = document.querySelector('#selector-input') as HTMLInputElement;
    private result = document.querySelector('#result') as HTMLDivElement;
    private visualization = document.querySelector(visualizationSelector) as HTMLDivElement;
    private visualizationStyle = document.querySelector('#visualization-style') as HTMLStyleElement;
    private specificityLink = document.querySelector('#specificity-link') as HTMLAnchorElement;
    private specificityResult = document.querySelector('#specificity-result') as HTMLDivElement;

    private previousInput = '';

    constructor() {
        this.fillInputFromURL();
        this.input.addEventListener('input', this.initiate);
    }

    private initiate = () => {
        const input = this.input.value.trim();
        if (input) {
            if (this.validateInput(input)) {
                return;
            }
            this.translate(input);
            this.previousInput = input;
        } else {
            this.clear();
        }
    };

    private validateInput = (input: string) => {
        return input === this.previousInput || input.endsWith(',');
    };

    private translate(value: string) {
        const { translation, specificity } = translate(value);
        const taggedTranslation = this.getTags(translation);

        this.result.innerHTML = taggedTranslation;

        this.updateQueryParam(value);
        this.visualization.innerHTML = '';

        const unsupportedMessage = this.validateInputForVisualization(specificity ?? [], translation);
        if (unsupportedMessage) {
            this.visualization.innerHTML = unsupportedMessage;
        } else {
            this.specificityLink.href = `https://polypane.app/css-specificity-calculator/#selector=${encodeURIComponent(
                value
            )}`;
            this.specificityLink.innerText = 'Specificity';
            this.specificityResult.innerText = `: [${specificity!.join('], [ ')}]`;
            this.visualize(value);
        }
    }

    private validateInputForVisualization(specificity: Specificity[], translation: string) {
        if (translation.includes('Error')) {
            return 'No visualization due to selector input error';
        }
        if (translation.includes('unknown pseudo class')) {
            return 'No visualization due to unknown pseudo class';
        }
        if (translation.includes('<script>')) {
            return 'No visualization for script element';
        }
        if (specificity.length > 1) {
            return 'Visualization not supported for multiple selectors';
        }
    }

    private updateQueryParam(value: string) {
        const params = new URLSearchParams(window.location.search);
        if (!value) {
            params.delete('s');
        } else {
            params.set('s', encodeURIComponent(value));
        }
        history.pushState(null, '', '?' + params.toString());
    }

    private clear() {
        this.input.value = '';
        this.result.innerText = '';
        this.visualizationStyle.innerHTML = '';
        this.visualization.innerHTML = '';
        this.previousInput = '';
        this.updateQueryParam('');
    }

    private fillInputFromURL() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('s')) {
            const value = decodeURIComponent(params.get('s')!);
            this.input.value = value;
            this.translate(value);
        }
    }

    private getTags(value: string) {
        const tagged = [];

        const escaped = value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        for (const [index, part] of escaped.split("'").entries()) {
            tagged.push(index % 2 ? `<mark>${part}</mark>` : part);
        }
        return tagged.join('');
    }

    private visualize = (value: string) => {
        const visualization = visualize(value);

        const elements = [];
        for (const element of visualization) {
            const el = createVisualizationElement(element);
            elements.push(el);
        }

        this.visualization.append(...elements);
        this.visualizationStyle.innerHTML = getVisualizationStyle(visualizationSelector, value);
    };
}

window.App = new App();
