import { Query, SchoolQueryObject } from '../../interfaces/queries';

const queryObject: SchoolQueryObject = {
  type: 'school',
  include: ['city'],
};

export const query: Query = {
  slug: 'schools-includeSingle',
  description: 'WIP',
  path: '/schools?include=city',
  object: queryObject,
};
