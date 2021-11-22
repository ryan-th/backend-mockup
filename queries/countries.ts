import { Query } from '../interfaces/queries';

export function getCountryQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'countries-filterById',
    path: '/countries?fields[country]=name&filter[id]=6,7',
    status: 'Done',
  },
];
