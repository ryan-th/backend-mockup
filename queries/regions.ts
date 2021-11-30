import { Query } from '../interfaces/queries';

export function getRegionQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'regions-filterById',
    path: '/regions?filter[id]=1,3',
    status: 'Done',
  },
  {
    slug: 'regions-noParams',
    path: '/regions',
    status: 'Done',
  },
];
