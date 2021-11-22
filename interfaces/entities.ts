// generic

import { JSONSchema7 } from 'json-schema';

export type EntitySetName =
  | 'academicSystems'
  | 'cities'
  | 'countries'
  | 'schools';

export type EntityName = 'academicSystem' | 'city' | 'country' | 'school';

export interface Entity {
  type: string;
  id: number;
}

export interface EntitySet {
  name: EntitySetName;
  entityName: EntityName;
  defaultPropertyNames: string[];
  data: Entity[];
  querySchema: JSONSchema7;
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
