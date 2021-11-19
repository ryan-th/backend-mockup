import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  sort: ['name'],
};

export const query: Query = {
  slug: 'cities-sortByName',
  path: '/cities?sort=name',
  object: queryObject,
};
