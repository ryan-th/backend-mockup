import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  // path: '/cities?fields[city]=name,slug&filter[id]=2,23',
  type: 'city',
  fields: {
    city: ['name', 'slug'],
  },
  filter: {
    id: [2, 23],
  },
};

export const query: Query = {
  slug: 'cities-filterById',
  path: '/cities?fields[city]=name,slug&filter[id]=2,23',
  object: queryObject,
};
