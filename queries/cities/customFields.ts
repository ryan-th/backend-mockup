import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
};

export const query: Query = {
  slug: 'cities-customFields',
  path: '/cities?fields[city]=imageUrl',
  object: queryObject,
};
