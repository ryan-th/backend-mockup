// generic

export type EntitySetName =
  | 'academicSystems'
  | 'cities'
  | 'countries'
  | 'schools';

export type EntityName = 'academicSystem' | 'city' | 'country' | 'school';

export interface Entity {
  id: number;
}

export interface EntitySet {
  name: EntitySetName;
  entityName: EntityName;
  defaultPropertyNames: string[];
  data: Entity[];
}

// specific
export interface AcademicSystem extends Entity {
  name: string;
}

export interface City extends Entity {
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface Country extends Entity {
  name: string;
  slug: string;
}

export interface School extends Entity {
  name: string;
  slug: string;
  cityId: number;
  hasBeenVisitedByTh?: boolean;
}
