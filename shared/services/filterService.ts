// TODO: add tests
// TODO: move higher (match operators - for filtering)
export function isMatch_stringMatches(
  value: string,
  matchValue: string
): boolean {
  if (value === undefined) return true;
  if (matchValue === undefined) return true;
  return value.toLowerCase().startsWith(matchValue.toLowerCase());
}

export function isMatch_stringEq(value: string, matchValue: string): boolean {
  if (value === undefined) return true;
  if (matchValue === undefined) return true;
  return value.toLowerCase() === matchValue.toLowerCase();
}

export function isMatch_numberEq(value: number, matchValue: number): boolean {
  if (value === undefined) return true;
  if (matchValue === undefined) return true;
  return value === matchValue;
}

export function isMatch_entitySetIncludes(
  value: any,
  matchValue: any[]
): boolean {
  if (value === undefined || value === []) return true;
  if (matchValue === undefined) return true;
  return matchValue.includes(value);
}
