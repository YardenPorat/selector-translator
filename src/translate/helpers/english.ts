export function isVowelPrefix(str: string) {
    if (['ul'].includes(str)) {
        return false;
    }
    return ['li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(str) || ['a', 'e', 'o', 'i', 'u'].includes(str[0]);
}

export function getVowelPrefix(str: string) {
    if (isVowelPrefix(str)) {
        return 'an';
    }
    return 'a';
}
