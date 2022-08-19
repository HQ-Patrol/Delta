import text from "../constants/text";

export function rnd(a: number, b: number) { return Math.trunc(Math.random() * (b - a) + a); }
export function inRange(a: number, x: number, y: number) { return (x <= a && a <= y); }
export function chunk(arr: unknown[], size: number) { return arr.slice(0, (arr.length + size - 1) / size | 0).map((_: unknown, i: number) => arr.slice(size * i, size * i + size)); }
export function footer() { return text.footer[rnd(0, footer.length - 1)]; }
