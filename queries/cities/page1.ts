import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  fields: {},
  page: {
    size: 2,
    number: 1,
  },
};

export const query: Query = {
  slug: 'cities-page1',
  path: '/cities?page[size]=2&page[number]=1',
  object: queryObject,
};
