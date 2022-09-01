const NumberAbbrevs = {
  h: 100,
  k: 1000,
  m: 1000000
};

function expandNumber(string: string) {
  const last = string.at(-1);

  if (last && ["h", "k", "m"].includes(last)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return parseInt(string.slice(0, string.length - 1), 10) * NumberAbbrevs[last];
  }

  return parseInt(string, 10);
}

export function parse(string: string, all: number) {
  if (string === "all" || string === "max") {
    return all;
  }
  if (string === "half") {
    return Math.floor(all / 2);
  }

  // Expand
  const num = expandNumber(string);
  if (Number.isNaN(num)) return -1;

  return num;
}

export function getMaximumCompacity(level: number, bracket: number) {
  let capacity = 0;
  for (let i = 1; i <= 100; i += 1) {
    if (i > level) break;
    if (i <= 10) capacity += 10000;
    if (i > 10 && i <= 20) capacity += 40000;
    if (i > 20 && i <= 30) capacity += 50000;
    if (i > 30 && i <= 40) capacity += 150000;
    if (i > 40 && i <= 60) capacity += 250000;
    if (i > 60 && i <= 80) capacity += 375000;
    if (i > 80 && i <= 90) capacity += 500000;
    if (i > 90) capacity += 1000000 * (i - 90);
  }

  // Tax bracket
  switch (bracket) {
  case 2:
    capacity += 1000000;
    break;
  case 3:
    capacity += 2500000;
    break;
  case 4:
    capacity += 5000000;
    break;
  case 5:
    capacity += 10000000;
    break;
  default:
    break;
  }

  return capacity;
}
