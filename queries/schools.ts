import { Query } from '../interfaces/queries';

export function getSchoolQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'schools-includeComplex1',
    description: 'WIP',
    path: '/schools?fields[school]=name,hasBeenVisitedByTh&filter[city.id]=1,2&include=city,academicSystem&fields[city]=name',
    status: 'TODO',
  },
  {
    slug: 'schools-includeComplex2',
    path: '/schools?fields[school]=name&filter[city.id]=1,2&include=city,city.country&fields[city]=name&fields[city.country]=name,slug',
    status: 'TODO',
  },
  {
    slug: 'schools-includeDepth2',
    description: 'WIP',
    path: '/schools?include=city,city.country',
    status: 'TODO',
  },
  {
    slug: 'schools-includeDepth3',
    description: 'WIP',
    path: '/schools?include=city,city.country,city.country.region',
    status: 'TODO',
  },
  {
    slug: 'schools-includeMultiple',
    description: 'WIP',
    path: '/schools?include=city,academicSystem',
    status: 'TODO',
  },
  {
    slug: 'schools-includeSingle',
    description: 'WIP',
    path: '/schools?include=city',
    status: 'TODO',
  },
];
