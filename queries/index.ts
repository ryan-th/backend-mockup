import { Query, QueryStatus } from './../interfaces/queries';

import { compareFnGenerator } from '../shared/services/dataService';

import { getAcademicSystemQueries } from './academicSystems';
import { getCityQueries } from './cities';
import { getCountryQueries } from './countries';
import { getRegionQueries } from './regions';
import { getSchoolAcademicSystemQueries } from './schoolAcademicSystems';
import { getSchoolQueries } from './schools';

// TODO: move higher
const list_moveItem = (list: any[], fromIndex: number, toIndex: number) => {
  const clone = [...list];
  const item = clone.splice(fromIndex, 1)[0];
  clone.splice(toIndex, 0, item);
  return clone;
};

export function getQueryStatusColor(queryStatus: QueryStatus): string {
  const map: Record<QueryStatus, string> = {
    Done: '#50b848',
    WIP: '#fcd25a',
    TODO: '#ff725e',
  };
  return map[queryStatus];
}

function getQueries(): Query[] {
  // edit this to whichever query you're currently working on
  const defaultQuerySlug = 'cities-filterByCountryId';

  let queries: Query[] = [
    ...getAcademicSystemQueries(),
    ...getCityQueries(),
    ...getCountryQueries(),
    ...getRegionQueries(),
    ...getSchoolAcademicSystemQueries(),
    ...getSchoolQueries(),
  ];

  const compareFn = compareFnGenerator<Query>(['slug']);
  queries = queries.sort(compareFn);

  const defaultQueryIndex = queries.findIndex(
    (x) => x.slug === defaultQuerySlug
  );
  if (defaultQueryIndex === -1) {
    console.warn('defaultQuerySlug not found:', defaultQuerySlug);
  } else {
    queries = list_moveItem(queries, defaultQueryIndex, 0);
  }

  return queries;
}

export const queries: Query[] = getQueries();
