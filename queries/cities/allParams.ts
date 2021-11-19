import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  // no longer needed
};

export const query: Query = {
  slug: 'cities-allParams',
  path: '/cities?fields[city]=foo,bar,baz&fields[city.country]=foo&sort=foo,-bar&page[size]=2&filter[name][matches]=li&filter[id]=2,23&filter[hasBeenVisitedByTh]=true',
  object: queryObject,
};
