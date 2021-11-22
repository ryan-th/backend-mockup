import { Query } from '../interfaces/queries';

export function getAcademicSystemQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'academicSystems-filterById',
    path: '/academicSystems?filter[id]=2,4',
    status: 'Done',
  },
];
