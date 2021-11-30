import { Country } from '../../interfaces/entities';

export const countries: Country[] = [
  {
    type: 'country',
    id: 5,
    name: 'Portugal',
    slug: 'country-slug-1',
  },
  {
    type: 'country',
    id: 6,
    name: 'China',
    slug: 'country-slug-2',
  },
  {
    type: 'country',
    id: 7,
    name: 'Egypt',
    slug: 'country-slug-3',
  },
];

export const allCountryPropertyNames: (keyof Country)[] = [
  'id',
  'type',
  'name',
  'slug',
];
export const defaultCountryPropertyNames: (keyof Country)[] = ['name', 'slug'];
