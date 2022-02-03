import { translate } from '../translate';
import './style.css';

export class App {
    private input = document.querySelector('#selector-input') as HTMLInputElement;
    private result = document.querySelector('#result') as HTMLDivElement;

    constructor() {
        this.fillInputFromURL();
        this.input.addEventListener('input', this.initiate);
    }

    private initiate = () => {
        if (this.input.value) {
            this.translate(this.input.value);
        } else {
            this.clear();
        }
    };

    private translate(value: string) {
        this.result.innerText = translate(value);
        this.updateQueryParam(value);
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
}

window.App = new App();
