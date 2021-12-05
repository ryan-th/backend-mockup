import { BaseTest } from '.';
// import { entitySets } from '../../../modules/regional/data';
import { Query, QueryError } from '../../../interfaces/queries';
import { mainModuleService } from '../../../modules/main';
import { deriveQueryFromQueryPath, validateQuery } from '../queryService';
import { structureService } from '../structureService';

interface Test extends BaseTest {
  inputs: Query[];
  expect: QueryError;
  result?: QueryError;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults(): BaseTest[] {
  const prepare = deriveQueryFromQueryPath;
  mainModuleService.createStructure();
  const entitySets = structureService.entitySets;
  // const entitySets = mainModuleService.entitySets;
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
    test.result = validateQuery.call(this, entitySets, ...test.inputs);
    test.isSuccess =
      JSON.stringify(test.result) === JSON.stringify(test.expect);
    return test;
  });

  return results;
}
