export function joiner(items: string[]) {
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    if (items.length > 2) return `${items.slice(0, -1).join(', ')} and ${items.at(-1)!}`;
    return items[0];
}
