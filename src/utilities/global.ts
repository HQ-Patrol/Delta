import text from "../constants/text";

export const rnd = (a: number, b: number) => Math.trunc(Math.random() * (b - a) + a);
export const inRange = (a: number, x: number, y: number) => (x <= a && a <= y);
export const chunk = (arr: any[], size: number) => arr.slice(0, Math.floor((arr.length + size - 1) / size)).map((_, i) => arr.slice(size * i, size * i + size));
export const footer = () => text.footer[rnd(0, text.footer.length - 1)];
