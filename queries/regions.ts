import { Query } from '../interfaces/queries';

export function getRegionQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'regions-filterById',
    path: '/regions?filter[id]=1,4',
    status: 'TODO',
  },
  {
    slug: 'regions-noParam',
    path: '/regions',
    status: 'TODO',
  },
];
