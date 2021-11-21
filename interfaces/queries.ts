import { AcademicSystem, City, Country, EntityName, School } from './entities';
import { Errors } from './jsonapi-typescript';

// generic
export type QueryPath = string;

// TODO: consider refactoring
export interface Query {
  slug: string;
  description?: string;
  path: QueryPath;
  object: QueryObject;

  // WIP
  isValidObject?: boolean;
  errors?: Errors;
}

export interface QueryObjectPage {
  size?: number;
  number?: number;
}

export type QueryObjectKey = keyof QueryObject;
export type Operator = 'matches' | 'lt' | 'lte' | 'gt' | 'gte' | 'in';

export interface QueryObject {
  type: EntityName;

  // TODO: schema param so e.g. admin can request school view
  schema?: string;
  fields?: {};
  filter?: {};
  include?: string[];
  sort?: string[];
  page?: QueryObjectPage;
}

export type QueryErrorSlug = 'invalid-resource';

export interface QueryError {
  slug: QueryErrorSlug;
}

// specific
export interface SchoolQueryObject extends QueryObject {
  page?: QueryObjectPage;
  fields?: {
    school?: (keyof School)[];
    academicSystem?: (keyof AcademicSystem)[];
    city?: (keyof City)[];
    'city.country'?: (keyof Country)[];
  };
  filter?: {
    id?: FilterOperator;
    name?: FilterOperator;
    cityId?: FilterOperator;
    hasBeenVisitedByTh?: FilterOperator;
  };

  // filter?: {
  //   id?: number[];
  //   name?: {
  //     matches?: string;
  //   };
  //   academicSystem?: {
  //     id?: number[];
  //   };
  //   city?: {
  //     id?: number[];
  //     name?: {
  //       matches?: string;
  //     };
  //   };
  //   'city.country'?: {
  //     id?: number[];
  //     name?: {
  //       matches?: string;
  //     };
  //   };
  // };
  // always singular? => probably
  include?: (
    | 'city'
    | 'academicSystem'
    | 'city.country'
    | 'city.country.region'
  )[];
  sort?: (keyof School)[];
}

export interface FilterOperator {
  matches?: string;
  gt: number;
  lt: number;
  gte: number;
  lte: number;
  in: number[] | string[] | boolean[];
}

export interface CityQueryObject extends QueryObject {
  fields?: {
    city?: (keyof City)[];
    country?: (keyof Country)[];
  };
  filter?: {
    id?: FilterOperator;
    name?: FilterOperator;
    slug?: FilterOperator;
    imageUrl?: FilterOperator;
    // score?: FilterOperator;
    // hasBeenVisitedByTh?: FilterOperator;
    // description?: FilterOperator;
  };
  page?: QueryObjectPage;
  sort?: (
    | `-${keyof City}`
    | keyof City
    | `-country.${keyof Country}`
    | `country.${keyof Country}`
  )[];
}

export interface CountryQueryObject extends QueryObject {
  fields?: {
    country?: (keyof Country)[];
    // region?: (keyof Region)[];
  };
  filter?: {
    id?: FilterOperator;
    name?: FilterOperator;
    slug?: FilterOperator;
  };
  page?: QueryObjectPage;
  sort?: (
    | `-${keyof Country}`
    | keyof Country
    // | `-region.${keyof Region}`
    // | `region.${keyof Region}`
  )[];
}

export interface AcademicSystemQueryObject extends QueryObject {
  fields?: {
    academicSystem?: (keyof AcademicSystem)[];
  };
  filter?: {
    id?: FilterOperator;
    name?: FilterOperator;
  };
  page?: QueryObjectPage;
  sort?: (`-${keyof AcademicSystem}` | keyof AcademicSystem)[];
}
