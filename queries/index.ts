import { Query } from './../interfaces/queries';

import { compareFnGenerator } from '../services/dataService';

import { getAcademicSystemQueries } from './academicSystems';
import { getCityQueries } from './cities';
import { getCountryQueries } from './countries';
import { getSchoolQueries } from './schools';

// TODO: move higher
const list_moveItem = (list: any[], fromIndex: number, toIndex: number) => {
  const clone = [...list];
  const item = clone.splice(fromIndex, 1)[0];
  clone.splice(toIndex, 0, item);
  return clone;
};

function getQueries(): Query[] {
  // edit this to whichever query you're currently working on
  const defaultQuerySlug = 'schools-includeSingle';

  let queries: Query[] = [
    ...getAcademicSystemQueries(),
    ...getCityQueries(),
    ...getCountryQueries(),
    ...getSchoolQueries(),
  ];

  const compareFn = compareFnGenerator<Query>(['slug']);
  queries = queries.sort(compareFn);

  const defaultQueryIndex = queries.findIndex(
    (x) => x.slug === defaultQuerySlug
  );
  queries = list_moveItem(queries, defaultQueryIndex, 0);

  return queries;
}

export const queries: Query[] = getQueries();
