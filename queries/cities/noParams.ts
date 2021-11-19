import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
};

export const query: Query = {
  slug: 'cities-noParams',
  path: '/cities',
  object: queryObject,
};
