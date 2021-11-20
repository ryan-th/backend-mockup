import Ajv from 'ajv';
import { ValidateFunction } from 'ajv/dist/core';
import { entitySets } from '../data';
import {
  AcademicSystemQueryObject,
  CityQueryObject,
  CountryQueryObject,
  Operator,
  Query,
  QueryError,
  QueryObject,
  QueryObjectKey,
  SchoolQueryObject,
} from '../interfaces/queries';
import { cityQueryObjectSchema } from '../queries/schemas/cities';
import { schoolQueryObjectSchema } from '../queries/schemas/schools';
import { QueryParamObject } from '../tests/deriveQueryParamObjectFromQueryParamString';
import { mergeObjects } from './genericServices';

export const isSchoolQueryObject = (x: QueryObject): x is SchoolQueryObject =>
  x.type === 'school';

export const isCityQueryObject = (x: QueryObject): x is CityQueryObject =>
  x.type === 'city';

export const isCountryQueryObject = (x: QueryObject): x is CountryQueryObject =>
  x.type === 'country';

export const isAcademicSystemQueryObject = (
  x: QueryObject
): x is AcademicSystemQueryObject => x.type === 'academicSystem';

export function deriveQueryFromQueryPath(queryPath: string): Query {
  const queryObject = deriveQueryObjectFromQueryPath(queryPath);

  // TODO: refactor
  return {
    slug: 'custom',
    description: 'custom query',
    path: queryPath,
    object: queryObject,
  };
}

export function deriveQueryObjectFromQueryPath(queryPath: string): QueryObject {
  // /cities/1 => { type: 'city', filter: { id: { in: [1] } } }
  // see tests for more examples
  if (queryPath == null) return;
  if (queryPath.length === 0) return;
  if (queryPath.slice(0, 1) !== '/') return;

  const queryParts = queryPath.split('?');
  if (![1, 2].includes(queryParts.length)) return;

  const entityParts = queryParts[0].split('/');
  if (![2, 3].includes(entityParts.length)) return;

  const entitySetName = entityParts[1];
  const entityId = entityParts[2];

  const entitySet = entitySets.find((x) => x.name === entitySetName);
  if (!entitySet) return;

  const queryParamStrings = queryParts[1]?.split('&') || [];
  if (entityId) queryParamStrings.push('filter[id]=' + entityId);

  if (queryParamStrings == null) return { type: entitySet.entityName };

  const queryParamObjects = queryParamStrings.map((x) =>
    deriveQueryParamObjectFromQueryParamString(x)
  );

  const queryParamObject = <QueryObject>mergeObjects({}, ...queryParamObjects);

  return { type: entitySet.entityName, ...queryParamObject };
}

export function parseToTypedValue(s: string): number | boolean | string {
  // '3' => 3
  // see tests for more examples
  if (s === undefined) return undefined;
  if (s === null) return null;
  if (s === '') return '';
  if (!isNaN(+s)) return +s;
  if (s === 'true') return true;
  if (s === 'false') return false;
  return s;
}

export function deriveQueryParamObjectFromQueryParamString(
  paramString: string
): QueryParamObject {
  // 'filter[property1][matches]=li' => { filter: { property1: { matches: 'li' } } }
  // see tests for more examples
  if (paramString == null) return;

  const paramParts = paramString.split('=');
  if (![2].includes(paramParts.length)) return;

  const nameParts = paramParts[0].split('[').map((x) => x.replace(']', ''));
  if (![1, 2, 3].includes(nameParts.length)) return;

  const category = <QueryObjectKey>nameParts[0];

  const valueString = paramParts[1];
  let valueParts = valueString.split(',').map((x) => parseToTypedValue(x));

  if (category === 'fields') {
    const entityPath = nameParts?.[1];
    if (entityPath == null) return;
    return { fields: { [entityPath]: valueParts } };
  } else if (category === 'filter') {
    const operator = <Operator>nameParts?.[2] || 'in';
    let value: any;
    if (['in'].includes(operator)) {
      value = valueParts;
    } else if (['gt', 'gte', 'lt', 'lte'].includes(operator)) {
      value = +valueString;
    } else if (['matches'].includes(operator)) {
      value = valueString;
    }
    return { filter: { [nameParts?.[1]]: { [operator]: value } } };
  } else if (category === 'include') {
    return { include: valueString.split(',') };
  } else if (category === 'page') {
    const propertyName = nameParts?.[1];
    if (['number', 'size'].includes(propertyName)) {
      return { page: { [propertyName]: +valueString } };
    }
  } else if (category === 'schema') {
    console.log('TODO');
  } else if (category === 'sort') {
    return { sort: valueString.split(',') };
  }
}

interface Validators {
  isValidCityQueryObject: ValidateFunction<unknown>;
  isValidSchoolQueryObject: ValidateFunction<unknown>;
}

let validators: Validators;

function getValidators() {
  const ajv = new Ajv();
  return {
    isValidCityQueryObject: ajv.compile(cityQueryObjectSchema),
    isValidSchoolQueryObject: ajv.compile(schoolQueryObjectSchema),
  };
}

// TODO: add more cases; define behaviour; add more QueryError values
export function validateQuery(query: Query): QueryError {
  const qo: QueryObject = query.object;
  if (!validators) validators = getValidators();

  if (qo == null || qo.type === undefined) return { slug: 'invalid-resource' };

  if (isCityQueryObject(qo)) {
    const idValid = validators.isValidCityQueryObject(qo);
    if (!idValid) return { slug: 'invalid-resource' };
  }

  if (isSchoolQueryObject(qo)) {
    const idValid = validators.isValidSchoolQueryObject(qo);
    if (!idValid) return { slug: 'invalid-resource' };
  }

  return null;
}
