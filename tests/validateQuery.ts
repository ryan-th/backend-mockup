import { Test } from '.';
import { Query, QueryError } from '../interfaces/queries';
import {
  deriveQueryFromQueryPath,
  validateQuery,
} from '../services/queryService';

interface Test1 extends Test {
  inputs: Query[];
  expect: QueryError;
  result?: QueryError;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults(): Test[] {
  const prepare = deriveQueryFromQueryPath;
  const tests: Test1[] = [
    {
      inputs: [prepare('/cities')],
      expect: null,
    },
    {
      inputs: [prepare('/cities?sort=name')],
      expect: null,
    },
    {
      inputs: [prepare('/cities?sort=foo')],
      expect: {
        slug: 'invalid-resource',
      },
    },
    // TODO: add more tests
  ];

  const results = tests.map((test) => {
    test.functionName = 'validateQuery';
    test.result = validateQuery.call(this, ...test.inputs);
    test.isSuccess =
      JSON.stringify(test.result) === JSON.stringify(test.expect);
    return test;
  });

  return results;
}
