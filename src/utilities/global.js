module.exports.rnd = (a, b) => Math.trunc(Math.random() * (b - a) + a);
module.exports.inRange = (a, x, y) => (x <= a && a <= y);
// eslint-disable-next-line no-bitwise
module.exports.chunk = (arr, size) => arr.slice(0, (arr.length + size - 1) / size | 0).map((_, i) => arr.slice(size * i, size * i + size));
