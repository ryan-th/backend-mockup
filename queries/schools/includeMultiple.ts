import { Query, SchoolQueryObject } from '../../interfaces/queries';

const queryObject: SchoolQueryObject = {
  type: 'school',
  include: ['city', 'academicSystem'],
};

export const query: Query = {
  slug: 'schools-includeMultiple',
  description: 'WIP',
  path: '/schools?include=city,academicSystem',
  object: queryObject,
};
