import { BaseTest } from '.';
import { Query, QueryError } from '../interfaces/queries';
import {
  deriveQueryFromQueryPath,
  validateQuery,
} from '../services/queryService';

interface Test extends BaseTest {
  inputs: Query[];
  expect: QueryError;
  result?: QueryError;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults(): BaseTest[] {
  const prepare = deriveQueryFromQueryPath;
  const tests: Test[] = [
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
