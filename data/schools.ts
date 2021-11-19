import { School } from '../interfaces/entities';

export const schools: School[] = [
  {
    id: 2848,
    name: 'Academie Laurentienne',
    slug: 'school-slug-1',
    cityId: 1,
    hasBeenVisitedByTh: false,
  },
  {
    id: 128,
    name: 'Foo',
    slug: 'school-slug-2',
    cityId: 2,
    hasBeenVisitedByTh: true,
  },
  {
    id: 1923,
    name: 'Bar',
    slug: 'school-slug-3',
    cityId: 23,
    hasBeenVisitedByTh: false,
  },
];

export const defaultSchoolPropertyNames: (keyof School)[] = ['name', 'slug'];
