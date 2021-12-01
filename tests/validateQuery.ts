import { BaseTest } from '.';
import { entitySets } from '../data';
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
      inputs: [prepare(entitySets, '/cities')],
      expect: null,
    },
    {
      inputs: [prepare(entitySets, '/cities?sort=name')],
      expect: null,
    },
    {
      inputs: [prepare(entitySets, '/cities?sort=foo')],
      // TODO RR/JP: define required error response
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
