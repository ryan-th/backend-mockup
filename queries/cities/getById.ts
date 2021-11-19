import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
};

export const query: Query = {
  slug: 'cities-getById',
  path: '/cities/2',
  object: queryObject,
};
