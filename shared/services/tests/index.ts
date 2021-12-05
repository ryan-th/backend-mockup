import { getTestResults as getTestResults_deriveQueryObjectFromQueryPath } from './deriveQueryObjectFromQueryPath';
import { getTestResults as getTestResults_deriveQueryParamObjectFromQueryParamString } from './deriveQueryParamObjectFromQueryParamString';
import { getTestResults$ as getTestResults_getResponseFromRequest$ } from './getResponseFromRequest';
import { getTestResults as getTestResults_parseToTypedValue } from './parseToTypedValue';
import { getTestResults as getTestResults_validateQuery } from './validateQuery';

export interface BaseTest {
  functionName?: string;
  inputs: any[];
  expect: any;
  result?: any;
  isSuccess?: boolean;
  note?: string;
}

export function runTests(): void {
  // TODO: merge the handling of non-observables and observables
  console.log('runTests - start');

  // non-observables
  const results = [
    ...getTestResults_deriveQueryObjectFromQueryPath(),
    ...getTestResults_deriveQueryParamObjectFromQueryParamString(),
    ...getTestResults_parseToTypedValue(),
    ...getTestResults_validateQuery(),
  ];
  const errors = results.filter((x) => !x.isSuccess);
  if (errors.length > 0) console.log('Test errors (non-observables):', errors);

  // observables
  getTestResults_getResponseFromRequest$().subscribe((results) => {
    const errors = results.filter((x) => !x.isSuccess);
    if (errors.length > 0) console.log('Test errors (observables):', errors);
  });
}
