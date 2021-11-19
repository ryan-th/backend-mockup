import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  fields: {},
  page: {
    size: 2,
    number: 2,
  },
};

export const query: Query = {
  slug: 'cities-page2',
  path: '/cities?page[size]=2&page[number]=2',
  object: queryObject,
};
