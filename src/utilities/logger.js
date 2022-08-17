const $ = require("chalk");
const moment = require("moment");

const PREFIX_WIDTH = 7;

function implMaxPrefix(prefix) {
  return prefix.length <= PREFIX_WIDTH ? prefix + " ".repeat(PREFIX_WIDTH - prefix.length) : prefix.slice(0, PREFIX_WIDTH);
}

function log(prefix, message, color = "blueBright", symbol = null) {
  return console.log(
    $.bgGray(` ${symbol ?? "*"} `),
    $[color].bold(implMaxPrefix(prefix)),
    $[color](`[${moment().format("LTS")}]`),
    $[color](message),
  );
}

function error(message, ...hints) {
  return console.log(
    $.bgRedBright(" ! "),
    $.redBright.bold(implMaxPrefix("ERROR")),
    $.redBright(`[${moment().format("LTS")}]`),
    $.redBright(hints.map((h) => `(${h}) `).join("") + message),
  );
}

function info(message) {
  return console.log(
    $.bgYellowBright(" i "),
    $.yellow.bold(implMaxPrefix("INFO")),
    $.yellow(`[${moment().format("LTS")}]`),
    $.yellow(message),
  );
}

module.exports = {
  log,
  error,
  info,
};
