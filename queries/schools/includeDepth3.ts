import { Query, SchoolQueryObject } from '../../interfaces/queries';

const queryObject: SchoolQueryObject = {
  type: 'school',
  include: ['city', 'city.country', 'city.country.region'],
};

export const query: Query = {
  slug: 'schools-includeDepth3',
  description: 'WIP',
  path: '/schools?include=city,city.country,city.country.region',
  object: queryObject,
};
