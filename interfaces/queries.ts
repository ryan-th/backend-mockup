import { AcademicSystem, City, Country, EntityName, School } from './entities';

// generic
export interface Query {
  slug: string;
  description?: string;
  path: string;
  object: QueryObject;
}

export interface QueryObjectPage {
  size?: number;
  number?: number;
}

export type QueryObjectKey = keyof QueryObject;
export type Operator = 'matches' | 'lt' | 'lte' | 'gt' | 'gte' | 'in';

export interface QueryObject {
  type: EntityName;
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
