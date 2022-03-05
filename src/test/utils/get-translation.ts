import { translate } from '../../translate/translate';
export const getTranslation = (selector: string) => {
    return translate(selector).translation;
};
