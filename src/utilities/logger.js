const $ = require("chalk");
const moment = require("moment");

function log(prefix, message, color = "blueBright") {
  return console.log(
    $[color].bold(prefix),
    $[color](`[${moment().format("LTS")}]`),
    $[color](message)
  );
}

function error(message) {
  return console.log(
    $["redBright"].bold("ERROR"),
    $["redBright"](`[${moment().format("LTS")}]`),
    $["redBright"](message)
  );
}

function info(message) {
  return console.log(
    $["yellow"].bold("INFO"),
    $["yellow"](`[${moment().format("LTS")}]`),
    $["yellow"](message)
  );
}

module.exports = { 
  log,
  error,
  info
};
