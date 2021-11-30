import { Query } from '../interfaces/queries';

export function getSchoolAcademicSystemQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'schoolAcademicSystems-forSchool',
    path: '/schoolAcademicSystems?filter[schoolId]=1&include=academicSystems',
    status: 'WIP',
  },
];
