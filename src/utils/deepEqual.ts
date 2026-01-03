export function isEqual(a: any, b: any): boolean {
    // Same reference or primitive equality
    if (a === b) return true;

    // Handle null/undefined
    if (a == null || b == null) return a === b;

    // Different types
    if (typeof a !== typeof b) return false;

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => isEqual(item, b[index]));
    }

    // Handle objects
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        return keysA.every(key =>
            Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key])
        );
    }

    // Not equal
    return false;
}
