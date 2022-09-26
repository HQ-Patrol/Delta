export function attemptExpand(str: string) {
  if (!str || str.length === 0) return false;

  // check if str ends in char
  const chars = {
    h: 100,
    k: 1000,
    m: 1000000,
  };

  if (Object.keys(chars).includes(str[str.length - 1])) {
    const sliced = str.slice(0, str.length - 1);
    if (isNaN(parseInt(sliced))) return false;

    const value = parseInt(sliced);
    if (value <= 0) return false;

    // @ts-ignore
    return value * chars[str[str.length - 1]];
  }

  return false;
}
