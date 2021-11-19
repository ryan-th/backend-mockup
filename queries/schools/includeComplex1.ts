import { Query, SchoolQueryObject } from '../../interfaces/queries';

const queryObject: SchoolQueryObject = {
  type: 'school',
  include: ['city', 'academicSystem'],
  // include: ['city'],
  // include: ['academicSystem'],
  fields: {
    school: ['name', 'hasBeenVisitedByTh'],
    city: ['name'],
    // TODO: add defaults to query object in 'runtime' code (so wouldn't need this - note that it's not in the path)
    // academicSystem: ['name'],
  },
  filter: {
    city: {
      id: [1, 2],
    },
  },
};

export const query: Query = {
  slug: 'schools-includeComplex1',
  description: 'WIP',
  path: '/schools?fields[school]=name,hasBeenVisitedByTh&filter[city.id]=1,2&include=city,academicSystem&fields[city]=name',
  object: queryObject,
};
