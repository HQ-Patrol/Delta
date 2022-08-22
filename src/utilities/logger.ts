import moment from "moment";
import $, { Color } from "chalk";

const PREFIX_WIDTH = 7;

function implMaxPrefix(prefix: string) {
  return prefix.length <= PREFIX_WIDTH ? prefix + " ".repeat(PREFIX_WIDTH - prefix.length) : prefix.slice(0, PREFIX_WIDTH);
}

function log(prefix: string, message: string, color: Color = "blueBright", symbol: string | null = null) {
  return console.log(
    $.bgGray(` ${symbol ?? "*"} `),
    $.keyword(color).bold(implMaxPrefix(prefix)),
    $.keyword(color)(`[${moment().format("LTS")}]`),
    $.keyword(message),
  );
}

function error(message: string, ...hints: string[]) {
  return console.log(
    $.bgRedBright(" ! "),
    $.redBright.bold(implMaxPrefix("ERROR")),
    $.redBright(`[${moment().format("LTS")}]`),
    $.redBright(hints.map((h) => `(${h}) `).join("") + message),
  );
}

function info(message: string) {
  return console.log(
    $.bgYellowBright(" i "),
    $.yellow.bold(implMaxPrefix("INFO")),
    $.yellow(`[${moment().format("LTS")}]`),
    $.yellow(message),
  );
}

export default {
  log,
  error,
  info,
};
