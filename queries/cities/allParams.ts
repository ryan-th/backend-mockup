import { Query } from '../../interfaces/queries';

export const query: Query = {
  slug: 'cities-allParams',
  path: '/cities?fields[city]=foo,bar,baz&fields[city.country]=foo&sort=foo,-bar&page[size]=2&filter[name][matches]=li&filter[id]=2,23&filter[hasBeenVisitedByTh]=true',
  status: 'TODO',
  description: 'add test, improve error handling',
};
