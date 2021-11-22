import { Query } from '../../interfaces/queries';

export const query: Query = {
  slug: 'cities-filterById',
  path: '/cities?fields[city]=name,slug&filter[id]=2,23',
  status: 'Done',
};
