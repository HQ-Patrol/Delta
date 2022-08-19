"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.footer = exports.chunk = exports.inRange = exports.rnd = void 0;
const text_1 = __importDefault(require("../constants/text"));
function rnd(a, b) { return Math.trunc(Math.random() * (b - a) + a); }
exports.rnd = rnd;
function inRange(a, x, y) { return (x <= a && a <= y); }
exports.inRange = inRange;
function chunk(arr, size) { return arr.slice(0, (arr.length + size - 1) / size | 0).map((_, i) => arr.slice(size * i, size * i + size)); }
exports.chunk = chunk;
function footer() { return text_1.default.footer[rnd(0, footer.length - 1)]; }
exports.footer = footer;
