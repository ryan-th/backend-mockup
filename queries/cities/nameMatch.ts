import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  fields: {
    city: ['name', 'slug'],
  },
  filter: {
    name: {
      matches: 'li',
    },
  },
};

export const query: Query = {
  slug: 'cities-nameMatch',
  path: '/cities?fields[city]=name,slug&filter[name][matches]=li',
  object: queryObject,
};
