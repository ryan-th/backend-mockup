import { AcademicSystem } from '../../../../interfaces/entities';

export const academicSystems: AcademicSystem[] = [
  {
    id: 1,
    name: 'International',
  },
  {
    id: 2,
    name: 'American',
  },
  {
    id: 3,
    name: 'British',
  },
  {
    id: 4,
    name: 'Indian',
  },
];

export const defaultAcademicSystemPropertyNames: (keyof AcademicSystem)[] = [
  'name',
];

/*
  "included": [
  {
    type: 'academicSystem",
    id: 1,
    attributes: {
      name: 'International',
    }
  },
  {
    type: 'city",
    id: 1,
    attributes: {
      name: 'Lisbon',
    }
  }
  ]
*/
