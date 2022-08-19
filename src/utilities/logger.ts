import $ from "chalk";
import moment from "moment";

const PREFIX_WIDTH = 7;

function implMaxPrefix(prefix: string) {
  return prefix.length <= PREFIX_WIDTH ? prefix + " ".repeat(PREFIX_WIDTH - prefix.length) : prefix.slice(0, PREFIX_WIDTH);
}

export function log(prefix: string, message: string, color = "blue", symbol: string | null = null) {
  return console.log(
    $.bgGray(` ${symbol ?? "*"} `),
    $.keyword(color).bold(implMaxPrefix(prefix)),
    $.keyword(color)(`[${moment().format("LTS")}]`),
    $.keyword(color)(message),
  );
}

export function error(message: string, ...hints: string[]) {
  return console.log(
    $.bgRedBright(" ! "),
    $.redBright.bold(implMaxPrefix("ERROR")),
    $.redBright(`[${moment().format("LTS")}]`),
    $.redBright(hints.map((h) => `(${h}) `).join("") + message),
  );
}

export function info(message: string) {
  return console.log(
    $.bgYellowBright(" i "),
    $.yellow.bold(implMaxPrefix("INFO")),
    $.yellow(`[${moment().format("LTS")}]`),
    $.yellow(message),
  );
}
