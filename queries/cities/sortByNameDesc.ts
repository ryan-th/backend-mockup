import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  sort: ['-name'],
};

export const query: Query = {
  slug: 'cities-sortByNameDesc',
  path: '/cities?sort=-name',
  object: queryObject,
};
