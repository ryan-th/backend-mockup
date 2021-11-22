import { Query } from '../interfaces/queries';

export function getSchoolQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'schools-includeComplex1',
    path: '/schools?fields[school]=name,hasBeenVisitedByTh&filter[city.id]=1,2&include=city,academicSystem&fields[city]=name',
    status: 'TODO',
    description:
      'shouldn`t error (json-schema additions needed); filtering on related entities needed',
  },
  {
    slug: 'schools-includeComplex2',
    path: '/schools?fields[school]=name&filter[city.id]=1,2&include=city,city.country&fields[city]=name&fields[city.country]=name,slug',
    status: 'TODO',
  },
  {
    slug: 'schools-includeDepth2',
    path: '/schools?include=city,city.country',
    status: 'TODO',
  },
  {
    slug: 'schools-includeDepth3',
    path: '/schools?include=city,city.country,city.country.region',
    status: 'WIP',
    description: 'hard; with AN',
  },
  {
    slug: 'schools-includeMultiple',
    path: '/schools?include=city,academicSystem&filter[id]=2848,1923',
    status: 'TODO',
    description: 'need multiple academicSystem relationships',
  },
  {
    slug: 'schools-includeSingle',
    path: '/schools?include=city&filter[id]=2848,1923',
    status: 'Done',
  },
];
