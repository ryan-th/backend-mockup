import { Query, SchoolQueryObject } from '../../interfaces/queries';

const queryObject: SchoolQueryObject = {
  type: 'school',
  include: ['city', 'city.country'],
};

export const query: Query = {
  slug: 'schools-includeDepth2',
  description: 'WIP',
  path: '/schools?include=city,city.country',
  object: queryObject,
};
