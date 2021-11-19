import { entitySets } from './data';
import { EntityName } from './interfaces/entities';
import {
  AcademicSystemQueryObject,
  CityQueryObject,
  CountryQueryObject,
  Operator,
  QueryObject,
  QueryObjectKey,
  SchoolQueryObject,
} from './interfaces/queries';
import { QueryParamObject } from './tests/deriveQueryParamObjectFromQueryParamString';

// TODO: move higher (match operators - for filtering)
export function match_stringMatches(
  value: string,
  matchValue: string
): boolean {
  if (value === undefined) return true;
  if (matchValue === undefined) return true;
  return value.toLowerCase().startsWith(matchValue.toLowerCase());
}

export function match_stringEq(value: string, matchValue: string): boolean {
  if (value === undefined) return true;
  if (matchValue === undefined) return true;
  return value.toLowerCase() === matchValue.toLowerCase();
}

export function match_numberEq(value: number, matchValue: number): boolean {
  if (value === undefined) return true;
  if (matchValue === undefined) return true;
  return value === matchValue;
}

export function match_listIncludes(value: any, matchValue: any[]): boolean {
  if (value === undefined || value === []) return true;
  if (matchValue === undefined) return true;
  return matchValue.includes(value);
}

export const isSchoolQueryObject = (x: QueryObject): x is SchoolQueryObject =>
  x.type === 'school';

export const isCityQueryObject = (x: QueryObject): x is CityQueryObject =>
  x.type === 'city';

export const isCountryQueryObject = (x: QueryObject): x is CountryQueryObject =>
  x.type === 'country';

export const isAcademicSystemQueryObject = (
  x: QueryObject
): x is AcademicSystemQueryObject => x.type === 'academicSystem';

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

// https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
// TODO: pick best one and improve
// export default function mergeDeep(target: Object, source: Object): Object {
//   function isObject(item: any) {
//     return item && typeof item === 'object' && !Array.isArray(item);
//   }

//   let output = Object.assign({}, target);
//   if (isObject(target) && isObject(source)) {
//     Object.keys(source).forEach((key) => {
//       if (isObject(source[key])) {
//         if (!(key in target)) Object.assign(output, { [key]: source[key] });
//         else output[key] = mergeDeep(target[key], source[key]);
//       } else {
//         Object.assign(output, { [key]: source[key] });
//       }
//     });
//   }
//   return output;
// }

// TODO: add tests
// TODO: move higher
export const mergeObjects = <T extends object = object>(
  target: T,
  ...sources: T[]
): T => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (source === undefined) {
    return target;
  }

  if (isMergebleObject(target) && isMergebleObject(source)) {
    Object.keys(source).forEach(function (key: string) {
      if (isMergebleObject(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }

  return mergeObjects(target, ...sources);
};

const isObject = (item: any): boolean => {
  return item !== null && typeof item === 'object';
};

const isMergebleObject = (item: any): boolean => {
  return isObject(item) && !Array.isArray(item);
};
