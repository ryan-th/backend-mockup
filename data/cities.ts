import { City } from '../interfaces/entities';

export const cities: City[] = [
  {
    id: 1,
    name: 'Lisbon',
    slug: 'city-slug-1',
    imageUrl: 'city-imageUrl-1',
  },
  {
    id: 2,
    name: 'Beijing',
    slug: 'city-slug-2',
  },
  {
    id: 23,
    name: 'Cairo',
    slug: 'city-slug-3',
    imageUrl: 'city-imageUrl-3',
  },
];

export const defaultCityPropertyNames: (keyof City)[] = ['name', 'slug'];
