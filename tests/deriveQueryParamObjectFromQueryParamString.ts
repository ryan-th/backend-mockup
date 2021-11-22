import { BaseTest } from '.';
import { deriveQueryParamObjectFromQueryParamString } from '../services/queryService';

// TODO: move
export interface QueryParamObject {
  fields?: {};
  filter?: {};
  include?: string[];
  sort?: string[];
  page?: {
    number?: number;
    size?: number;
  };
}

interface TestQueryParamObject extends QueryParamObject {
  fields?: {
    entity1?: ('property1' | 'property2' | 'property3')[];
    'entity1.relatedEntityA'?: 'propertyA'[];
  };
  filter?: {
    property1?: {
      matches?: string;
      in?: (number | string | boolean)[];
      gte?: number;
    };
  };
  include?: (
    | 'relatedEntityA'
    | 'relatedEntityB'
    | 'relatedEntityA.relatedEntityi'
  )[];
  sort?: ('property1' | '-property1' | 'property2' | '-property2')[];
  page?: {
    number?: number;
    size?: number;
  };
}

interface Test extends BaseTest {
  inputs: string[];
  expect: TestQueryParamObject;
  result?: TestQueryParamObject;
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
      expect: undefined,
    },
    {
      inputs: [''],
      expect: undefined,
    },
    {
      inputs: ['1'],
      expect: undefined,
    },
    {
      inputs: ['foo=1'],
      expect: undefined,
    },
    {
      inputs: ['fields=1'],
      expect: undefined,
    },
    {
      inputs: ['page=1'],
      expect: undefined,
    },
    {
      inputs: ['page[foo]=1'],
      expect: undefined,
    },
    {
      inputs: ['page[size]=foo'],
      // TODO: review
      expect: { page: { size: null } },
    },
    {
      inputs: ['include=relatedEntityA'],
      expect: { include: ['relatedEntityA'] },
    },
    {
      inputs: ['include=relatedEntityA,relatedEntityA.relatedEntityi'],
      expect: { include: ['relatedEntityA', 'relatedEntityA.relatedEntityi'] },
    },
    {
      inputs: ['fields[entity1]=property1,property2,property3'],
      expect: { fields: { entity1: ['property1', 'property2', 'property3'] } },
    },
    {
      inputs: ['fields[entity1.relatedEntityA]=propertyA'],
      expect: { fields: { 'entity1.relatedEntityA': ['propertyA'] } },
    },
    {
      inputs: ['sort=property1,-property2'],
      expect: { sort: ['property1', '-property2'] },
    },
    {
      inputs: ['page[size]=2'],
      expect: { page: { size: 2 } },
    },
    {
      inputs: ['filter[property1][matches]=li'],
      expect: { filter: { property1: { matches: 'li' } } },
    },
    {
      inputs: ['filter[property1]=2,23'],
      expect: { filter: { property1: { in: [2, 23] } } },
    },
    {
      inputs: ['filter[property1]=smith,jones,true'],
      expect: { filter: { property1: { in: ['smith', 'jones', true] } } },
      note: "true being a boolean is an edge case we're going to ignore for now",
    },
    {
      inputs: ['filter[property1]=true,false'],
      expect: { filter: { property1: { in: [true, false] } } },
    },
    {
      inputs: ['filter[property1][matches]=2021'],
      expect: { filter: { property1: { matches: '2021' } } },
    },
    {
      inputs: ['filter[property1]=2'],
      expect: { filter: { property1: { in: [2] } } },
    },
    {
      inputs: ['filter[property1]=true'],
      expect: { filter: { property1: { in: [true] } } },
    },
    {
      inputs: ['filter[property1][gte]=7'],
      expect: { filter: { property1: { gte: 7 } } },
    },
    {
      inputs: ['filter[property1]=10'],
      expect: { filter: { property1: { in: [10] } } },
    },
    {
      inputs: ['filter[property1]=7,8'],
      expect: { filter: { property1: { in: [7, 8] } } },
    },
  ];

  const results = tests.map((test) => {
    test.functionName = 'deriveQueryParamObjectFromQueryParamString';
    test.result = deriveQueryParamObjectFromQueryParamString.call(
      this,
      ...test.inputs
    );
    test.isSuccess =
      JSON.stringify(test.result) === JSON.stringify(test.expect);
    return test;
  });

  return results;
}
