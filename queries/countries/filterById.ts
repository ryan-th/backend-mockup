import { Query } from '../../interfaces/queries';

export const query: Query = {
  slug: 'countries-filterById',
  path: '/countries?fields[country]=name&filter[id]=6,7',
  status: 'Done',
};
