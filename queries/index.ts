import { compareFnGenerator } from '../services/dataService';
import { Query } from './../interfaces/queries';

import { query as academicSystems_filterById } from './academicSystems/filterById';

import { query as cities_allParams } from './cities/allParams';
import { query as cities_customFields } from './cities/customFields';
import { query as cities_filterById } from './cities/filterById';
import { query as cities_getById } from './cities/getById';
import { query as cities_includeCountry } from './cities/includeCountry';
import { query as cities_nameMatch } from './cities/nameMatch';
import { query as cities_noParams } from './cities/noParams';
import { query as cities_page1 } from './cities/page1';
import { query as cities_page2 } from './cities/page2';
import { query as cities_sortByName } from './cities/sortByName';
import { query as cities_sortByNameDesc } from './cities/sortByNameDesc';

import { query as countries_filterById } from './countries/filterById';

import { query as schools_includeComplex1 } from './schools/includeComplex1';
import { query as schools_includeComplex2 } from './schools/includeComplex2';
import { query as schools_includeDepth2 } from './schools/includeDepth2';
import { query as schools_includeDepth3 } from './schools/includeDepth3';
import { query as schools_includeMultiple } from './schools/includeMultiple';
import { query as schools_includeSingle } from './schools/includeSingle';

// [wip] TODO: error responses
// TODO: construct correct jsonApi
// [assigned to AN] TODO: multi-level queries (hard)
//    - [done] queries with 2 levels
//    - queries with 3 levels
//    - queries with 4 levels
//    - queries with n levels

// const schoolQuery_cityQuery: CityQueryObject = {
//   // path: undefined,
//   type: 'city',
//   include: ['country'],
//   fields: {
//     city: ['name'],
//     country: ['name', 'slug'],
//   },
//   filter: {
//     id: [1, 2],
//   },
// };

// TODO: move higher
const list_moveItem = (list: any[], fromIndex: number, toIndex: number) => {
  const clone = [...list];
  const item = clone.splice(fromIndex, 1)[0];
  clone.splice(toIndex, 0, item);
  return clone;
};

function getQueries(): Query[] {
  // edit this to whichever query you're currently working on
  const defaultQuery = cities_noParams;

  let queries: Query[] = [
    academicSystems_filterById,

    cities_allParams,
    cities_customFields,
    cities_filterById,
    cities_getById,
    cities_includeCountry,
    cities_nameMatch,
    cities_noParams,
    cities_page1,
    cities_page2,
    cities_sortByName,
    cities_sortByNameDesc,

    countries_filterById,

    schools_includeComplex1,
    schools_includeComplex2,
    schools_includeDepth2,
    schools_includeDepth3,
    schools_includeMultiple,
    schools_includeSingle,
  ];

  const compareFn = compareFnGenerator<Query>(['slug']);
  queries = queries.sort(compareFn);

  const defaultQueryIndex = queries.findIndex((x) => x === defaultQuery);
  queries = list_moveItem(queries, defaultQueryIndex, 0);

  return queries;
}

export const queries: Query[] = getQueries();
