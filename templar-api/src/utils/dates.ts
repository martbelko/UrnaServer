export function dateDiff(a: Date, b: Date): number {
    // Discard the time and time-zone information.
    const aUtc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const bUtc = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
    return Math.floor(Math.abs(aUtc - bUtc) / 1000.0);
}
