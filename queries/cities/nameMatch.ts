import { Query } from '../../interfaces/queries';

export const query: Query = {
  slug: 'cities-nameMatch',
  path: '/cities?fields[city]=name,slug&filter[name][matches]=li',
  status: 'Done',
};
