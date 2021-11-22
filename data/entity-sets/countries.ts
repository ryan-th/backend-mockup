import { Country } from '../../interfaces/entities';

export const countries: Country[] = [
  {
    id: 5,
    name: 'Portugal',
    slug: 'country-slug-1',
  },
  {
    id: 6,
    name: 'China',
    slug: 'country-slug-2',
  },
  {
    id: 7,
    name: 'Egypt',
    slug: 'country-slug-3',
  },
];

export const defaultCountryPropertyNames: (keyof Country)[] = ['name', 'slug'];
