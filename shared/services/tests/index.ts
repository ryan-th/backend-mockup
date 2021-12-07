import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  status?: 'TODO' | 'WIP';
  note?: string;
}

export function getTestResults(): Observable<BaseTest[]> {
  // returns the results from all tests
  const nonObservableResults = [
    ...getTestResults_deriveQueryObjectFromQueryPath(),
    ...getTestResults_deriveQueryParamObjectFromQueryParamString(),
    ...getTestResults_parseToTypedValue(),
    ...getTestResults_validateQuery(),
  ];

  return getTestResults_getResponseFromRequest$().pipe(
    map((observableResults) => {
      const allResults = [...nonObservableResults, ...observableResults];

      // const allErrors = allResults.filter((x) => !x.isSuccess);
      // if (allErrors.length > 0) console.log('Test errors:', allErrors);
      return allResults;
    })
  );
}
