// generic

import { JSONSchema7 } from 'json-schema';

export type EntitySetName =
  | 'academicSystems'
  | 'cities'
  | 'countries'
  | 'regions'
  | 'schools';

export type EntityName =
  | 'academicSystem'
  | 'city'
  | 'country'
  | 'region'
  | 'school';

export interface Entity {
  type?: EntityName; // possibly temporary
  id: number;
}

export interface EntitySet {
  name: EntitySetName;
  entityName: EntityName;
  allPropertyNames: string[];
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

export interface Region extends Entity {
  name: string;
  slug: string;
}

export interface School extends Entity {
  name: string;
  slug: string;
  // cityId: number;
  hasBeenVisitedByTh?: boolean;
}
