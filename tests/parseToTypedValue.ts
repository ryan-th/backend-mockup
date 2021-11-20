import { Test } from '.';
import { parseToTypedValue } from '../services/queryService';

interface Test1 extends Test {
  inputs: string[];
  expect: boolean | number | string;
  result?: boolean | number | string;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults(): Test[] {
  const tests: Test1[] = [
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
