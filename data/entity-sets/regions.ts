import { Region } from '../../interfaces/entities';

export const regions: Region[] = [
  {
    type: 'region',
    id: 3,
    name: 'Europe',
    slug: 'europe',
  },
  {
    type: 'region',
    id: 2,
    name: 'Asia',
    slug: 'asia',
  },
  {
    type: 'region',
    id: 1,
    name: 'Africa',
    slug: 'africa',
  },
];

export const defaultRegionPropertyNames: (keyof Region)[] = ['name', 'slug'];
