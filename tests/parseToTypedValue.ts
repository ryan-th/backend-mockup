import { BaseTest } from '.';
import { parseToTypedValue } from '../services/queryService';

interface Test extends BaseTest {
  inputs: string[];
  expect: boolean | number | string;
  result?: boolean | number | string;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults(): BaseTest[] {
  const tests: Test[] = [
    {
      inputs: [undefined],
      expect: undefined,
    },
    {
      inputs: [null],
      expect: null,
    },
    {
      inputs: [''],
      expect: '',
    },
    {
      inputs: ['3'],
      expect: 3,
    },
    {
      inputs: ['true'],
      expect: true,
    },
    {
      inputs: ['foo'],
      expect: 'foo',
    },
  ];

  const results = tests.map((test) => {
    test.functionName = 'parseToTypedValue';
    test.result = parseToTypedValue.call(this, ...test.inputs);
    test.isSuccess =
      JSON.stringify(test.result) === JSON.stringify(test.expect);
    return test;
  });

  return results;
}
