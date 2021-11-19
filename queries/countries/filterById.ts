import { CountryQueryObject, Query } from '../../interfaces/queries';

const queryObject: CountryQueryObject = {
  type: 'country',
  fields: {
    country: ['name'],
  },
  filter: {
    id: [6, 7],
  },
};

export const query: Query = {
  slug: 'countries-filterById',
  path: '/countries?fields[country]=name&filter[id]=6,7',
  object: queryObject,
};
