import { Query } from '../../interfaces/queries';

export const query: Query = {
  slug: 'cities-inPortugal',
  path: '/cities?include=country&filter[country.name]=Portugal',
  status: 'WIP',
};
