import { getTestResults as getTestResults_deriveQueryObjectFromQueryPath } from './deriveQueryObjectFromQueryPath';
import { getTestResults as getTestResults_deriveQueryParamObjectFromQueryParamString } from './deriveQueryParamObjectFromQueryParamString';
import { getTestResults as getTestResults_parseToTypedValue } from './parseToTypedValue';

export interface Test {
  functionName?: string;
  inputs: any[];
  expect: any;
  result?: any;
  isSuccess?: boolean;
  note?: string;
}

export function runTests(): void {
  const results = [
    ...getTestResults_deriveQueryObjectFromQueryPath(),
    ...getTestResults_deriveQueryParamObjectFromQueryParamString(),
    ...getTestResults_parseToTypedValue(),
  ];
  const errors = results.filter((x) => !x.isSuccess);
  if (errors.length > 0) console.log('Test errors:', errors);
}
