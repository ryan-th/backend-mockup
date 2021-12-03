import { EntitySet } from './entities';

export interface EntityRelationship {
  fromId: number;
  toId: number;
}

export type EntitySetRelationshipName =
  | 'countryRegions'
  | 'schoolAcademicSystems'
  | 'schoolCities'
  | 'cityCountries';

export type EntitySetRelationship = {
  name: EntitySetRelationshipName;
  fromEntitySet: EntitySet;
  toEntitySet: EntitySet;
  data: EntityRelationship[];
  sqlFrom: string;
};
