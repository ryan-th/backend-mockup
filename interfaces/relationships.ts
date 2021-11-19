export interface EntityRelationship {
  fromId: number;
  toId: number;
}

export type EntitySetRelationshipName =
  | 'schoolAcademicSystems'
  | 'schoolCities'
  | 'cityCountries';

export type EntitySetRelationship = {
  name: EntitySetRelationshipName;
  fromEntityName: string;
  toEntityName: string;
  data: EntityRelationship[];
};
