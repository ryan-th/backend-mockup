import { Test } from '.';
import { QueryObject } from '../interfaces/queries';
import { deriveQueryObjectFromQueryPath } from '../services/queryService';

interface Test1 extends Test {
  inputs: string[];
  expect: QueryObject;
  result?: QueryObject;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults(): Test[] {
  const tests: Test1[] = [
    {
      inputs: ['/cities'],
      expect: {
        type: 'city',
      },
    },
    {
      inputs: ['/schools'],
      expect: {
        type: 'school',
      },
    },
    {
      inputs: ['/cities/2'],
      expect: {
        type: 'city',
        filter: { id: { in: [2] } },
      },
    },
    {
      inputs: ['/cities?fields[entity1]=property1,property2,property3'],
      expect: {
        type: 'city',
        fields: { entity1: ['property1', 'property2', 'property3'] },
      },
    },
    // TODO: add more tests
  ];

  const results = tests.map((test) => {
    test.functionName = 'deriveQueryObjectFromQueryPath';
    test.result = deriveQueryObjectFromQueryPath.call(this, ...test.inputs);
    test.isSuccess =
      JSON.stringify(test.result) === JSON.stringify(test.expect);
    return test;
  });

  return results;
}
