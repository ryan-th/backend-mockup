// generic

import { JSONSchema7 } from 'json-schema';
import { EntitySetRelationship } from './relationships';

export type EntitySetName =
  | 'academicSystems'
  | 'cities'
  | 'countries'
  | 'regions'
  | 'schools'
  | 'schoolAcademicSystems';

export type EntityName =
  | 'academicSystem'
  | 'city'
  | 'country'
  | 'region'
  | 'school'
  | 'schoolAcademicSystem';

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
  relationships?: EntitySetRelationship[];
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

export interface SchoolAcademicSystem extends Entity {
  schoolId: number;
  academicSystemId: number;
  notes?: string; // example many-to-many with data on the association
}
