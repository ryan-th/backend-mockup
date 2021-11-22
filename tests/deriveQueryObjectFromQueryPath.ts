import { BaseTest } from '.';
import { QueryObject } from '../interfaces/queries';
import { deriveQueryObjectFromQueryPath } from '../services/queryService';

interface Test extends BaseTest {
  inputs: string[];
  expect: QueryObject;
  result?: QueryObject;
}

export function getTestResults(): BaseTest[] {
  const tests: Test[] = [
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
        fields: { entity1: ['property1', 'property2', 'properfty3'] },
      },
    },
    // TODO: add more tests
  ];

  const results = tests.map((test) => {
    test.functionName = 'deriveQueryObjectFromQueryPath';
    test.result = deriveQueryObjectFromQueryPath.call(this, ...test.inputs);
    const strResult = JSON.stringify(test.result);
    const strExpect = JSON.stringify(test.expect);
    test.isSuccess = strResult === strExpect;
    return test;
  });

  return results;
}
