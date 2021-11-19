import { Query, SchoolQueryObject } from '../../interfaces/queries';

const queryObject: SchoolQueryObject = {
  type: 'school',
  include: ['city', 'city.country', 'academicSystem'],
  fields: {
    school: ['name'],
    city: ['name'],
    'city.country': ['name', 'slug'],
  },
  filter: {
    city: {
      id: [1, 2],
    },
  },
};

export const query: Query = {
  slug: 'schools-includeComplex2',
  path: '/schools?fields[school]=name&filter[city.id]=1,2&include=city,city.country&fields[city]=name&fields[city.country]=name,slug',
  object: queryObject,
};
