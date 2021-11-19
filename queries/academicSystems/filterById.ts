import { AcademicSystemQueryObject, Query } from '../../interfaces/queries';

const queryObject: AcademicSystemQueryObject = {
  type: 'academicSystem',
  fields: {
    academicSystem: ['name'],
  },
  filter: {
    id: [2, 4],
  },
};

export const query: Query = {
  slug: 'academicSystems-filterById',
  path: '/academicSystems?filter[id]=2,4',
  object: queryObject,
};
