export function joiner(items: string[], options = { not: false }) {
    const joinWord = options.not ? 'or' : 'and';
    if (items.length === 2) {
        return `${items[0]} ${joinWord} ${items[1]}`;
    }
    if (items.length > 2) {
        return `${items.slice(0, -1).join(', ')} ${joinWord} ${items.at(-1)!}`;
    }
    return items[0];
}
