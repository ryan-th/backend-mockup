// rxjs
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// interfaces
import { City, Entity, EntityName, EntitySet } from '../interfaces/entities';
import { Query, QueryObject, QueryPath } from '../interfaces/queries';
import {
  EntityRelationship,
  EntitySetRelationshipName,
} from '../interfaces/relationships';

// data
import { entitySetRelationships, entitySets } from '../data';

// services
import {
  compareFnGenerator,
  entitiesPluck,
  getEntitySetRelationship,
} from './dataService';
import { isMatch_listIncludes, isMatch_stringMatches } from './filterService';
import {
  deriveQueryFromQueryPath,
  isAcademicSystemQueryObject,
  isCityQueryObject,
  isCountryQueryObject,
  isSchoolQueryObject,
  validateQuery,
} from './queryService';
import { JsonApiDocument } from '../interfaces/responses';
import {
  PrimaryData,
  ResourceObject,
} from '../interfaces/3rd-party/jsonapi-typescript';

// TODO: consider renaming to getJsonApiResponseFromQueryPath?
export function getResponseFromRequest$(
  queryPath: QueryPath
): Observable<JsonApiDocument> {
  const deriveQuery$ = (queryPath: QueryPath) => {
    console.log('queryPath:', queryPath);
    const query = deriveQueryFromQueryPath(queryPath);
    return combineLatest([of(query)]);
  };

  const validateQuery$ = ([query]: [Query]) => {
    console.log('query:', query, JSON.stringify(query));
    const queryErrors = validateQuery(query);
    query.isValidObject = !queryErrors;
    query.errors = queryErrors;
    return combineLatest([of(query), of(queryErrors)]);
  };

  // TODO: rename 'list' to 'entitySet'
  // TODO: remove need for 'any'
  const getList$ = ([query, queryErrors]: [Query, any[]]) => {
    console.log('queryErrors:', queryErrors);
    const list$ = getList(query);
    return combineLatest([of(query), list$]);
  };

  const deriveListIds$ = ([query, list]: [Query, EntitySet]) => {
    console.log('list:', list);
    const listIds = deriveListIds(list);
    return combineLatest([of(query), of(list), of(listIds)]);
  };

  const getListRelationships$ = ([query, list, listIds]: [
    Query,
    EntitySet,
    number[]
  ]) => {
    console.log('listIds:', listIds);
    const relationships$ = getListRelationships(query, listIds);
    return combineLatest([of(query), of(list), of(listIds), relationships$]);
  };

  const getIncluded$ = ([query, list, listIds, relationships]: [
    Query,
    EntitySet,
    number[],
    {} | Record<EntityName, EntityRelationship[]>
  ]) => {
    console.log('relationships:', relationships);
    const included$ = getIncluded(query, listIds, relationships);
    return combineLatest([
      of(query),
      of(list),
      of(listIds),
      of(relationships),
      included$,
    ]);
  };

  const deriveJsonApi$ = ([
    query,
    entitySet,
    listIds,
    relationships,
    included,
  ]: [
    Query,
    EntitySet,
    number[],
    {} | Record<EntityName, EntityRelationship[]>,
    Entity[]
  ]): Observable<JsonApiDocument> => {
    console.log('included:', included);
    const jsonApi = deriveJsonApi(query, entitySet, relationships, included);
    return of(jsonApi);
  };

  // https://medium.com/@snorredanielsen/rxjs-accessing-a-previous-value-further-down-the-pipe-chain-b881026701c1 - approach 2 (plus comment 1; plus later rxjs version)
  return of(queryPath).pipe(
    switchMap(deriveQuery$),
    switchMap(validateQuery$),
    switchMap(getList$),
    switchMap(deriveListIds$),
    switchMap(getListRelationships$),
    switchMap(getIncluded$),
    switchMap(deriveJsonApi$)
  );
}

// function deriveSubQuery(query: Query, entityName: string): Query {
//   // TODO: utilise; derive rather than hard-code
//   if (entityName === 'city') return queries[1];
// }

// TODO: move higher
// TODO: rename list to 'EntitySet'
function getList(query: Query): Observable<EntitySet> {
  // TODO: gradually improve matching to query
  const qo: QueryObject = query.object;
  let entitySet: EntitySet;

  if (!query.isValidObject) return of(null);

  entitySet = { ...entitySets.find((x) => x.entityName == qo.type) };

  if (isAcademicSystemQueryObject(qo)) {
    let data = entitySet.data;
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_listIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    entitySet.data = data;
  }

  if (isCityQueryObject(qo)) {
    let data = entitySet.data;

    console.log(777, data);

    // filtering; TODO: move higher
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_listIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    // sorting; TODO: move higher
    if (qo.sort?.length > 0) {
      const adaptedSort = qo.sort.map((x) =>
        x.startsWith('-') ? { key: x.slice(1), reverse: true } : x
      );
      data = data.sort(compareFnGenerator<any>(adaptedSort));
    }

    // paging; TODO: move higher
    const pageSize = qo.page?.size;
    if (pageSize) {
      const pageNumber = qo.page?.number || 1;
      const from = (pageNumber - 1) * pageSize;
      data = data.slice(from, from + pageSize);
    }

    entitySet.data = data;
  }

  if (isCountryQueryObject(qo)) {
    // entitySet.data = entitySet.data.filter((x) =>
    //   qo.filter?.id?.includes(x['id'])
    // );
    let data = entitySet.data;
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_listIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    entitySet.data = data;
  }

  if (isSchoolQueryObject(qo)) {
    // if (qo.filter.city) {
    //   entitySet.data = entitySet.data.filter((x) =>
    //     // if 'includes' is erroring, try adding a space to tsconfig.json (stackblitz bug workaround)
    //     qo.filter.city.id.includes(x['cityId'])
    //   );
    // }
    let data = entitySet.data;
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_listIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    entitySet.data = data;
  }

  // pluck requested fields
  const fieldNames: string[] =
    qo.fields?.[qo.type] || entitySet.defaultPropertyNames;

  // console.log(3333, entitySet, qo.fields, qo.type, fieldNames);
  entitySet.data = entitiesPluck(entitySet.data, fieldNames);

  return of(entitySet);
}

// TODO: move higher
function deriveListIds(entitySet: EntitySet): number[] {
  if (entitySet == null) return [];
  return entitySet.data.map((x) => x.id);
}

// TODO: move higher
function getListRelationships(
  query: Query,
  listIds: number[]
): Observable<Record<EntityName, EntityRelationship[]> | {}> {
  // TODO: consider this returning all 'relationships' AND 'included'
  if (!query.isValidObject) return of({});

  const relationships: Record<string, Observable<EntityRelationship[]>> = {};
  const fromEntityName = query.object.type;

  query.object.include?.forEach((toEntityName) => {
    // console.log(111, toEntityName);
    if (toEntityName.includes('.')) return;

    const listRelationship = getEntitySetRelationship(
      fromEntityName,
      toEntityName
    );
    // console.log(99, listRelationship);
    // const subQuery = deriveSubQuery(query, entityName);
    const filteredRelationship = listRelationship.data.filter((x) =>
      listIds.includes(x.fromId)
    );
    relationships[listRelationship.name] = of(filteredRelationship);
  });

  return Object.keys(relationships).length === 0
    ? of({})
    : forkJoin(relationships);
}

// TODO: move higher
function getIncluded(
  query: Query,
  listIds: number[],
  relationships: Record<EntitySetRelationshipName, EntityRelationship[]> | {}
): Observable<Entity[]> {
  let set = [];
  const qo = query.object;

  if (!query.isValidObject) return of(null);

  // console.log(555, qo, relationships, Object.keys(relationships));

  Object.keys(relationships).forEach((key) => {
    const listRelationship = entitySetRelationships.find((x) => x.name === key);
    const entitySet = entitySets.find(
      (x) => x.entityName === listRelationship.toEntityName
    );
    const toIds = [...new Set(relationships[key].map((x) => x.toId))];
    let subset = entitySet.data.filter((x) => toIds.includes(x.id));

    // pluck requested fields
    const fieldNames: string[] =
      qo.fields?.[listRelationship.toEntityName] ||
      entitySet.defaultPropertyNames;
    // console.log(333, entitySet, listRelationship.toEntityName, fieldNames);
    subset = entitiesPluck(subset, fieldNames);

    const children = qo.include.filter((x) =>
      x.startsWith(listRelationship.toEntityName + '.')
    );

    // console.log(77, children, query);

    // console.log(
    //   222,
    //   key,
    //   subset.map((x) => x.id)
    // );
    set = [...set, ...subset];
  });

  return of(set);
}

// TODO: move higher
// TODO: construct correct jsonApi
function deriveJsonApi(
  query: Query,
  entitySet: EntitySet,
  relationships: {} | Record<EntityName, EntityRelationship[]>,
  included: Entity[]
): JsonApiDocument {
  // console.log(13, included);
  if (!query.isValidObject) {
    return {
      errors: query.errors,
    };
  }
  // TODO: remove hard-coding
  const data = <PrimaryData>entitySet.data.map(({ id, ...rest }) => {
    const item: Partial<ResourceObject<any, any>> = {
      type: query.object.type,
      id: id.toString(),
    };
    if (rest) item.attributes = rest;
    if (Object.keys(relationships).length > 0) {
      item.relationships = {};

      const cityCountry = relationships['cityCountries']?.find(
        (rel: EntityRelationship) => id === rel.fromId
      );

      if (cityCountry) {
        item.relationships.country = {
          data: {
            type: 'country',
            id: cityCountry.toId.toString(),
          },
        };
      }

      // .map((rel: EntityRelationship) => {
      //   return {
      //     country: {
      //       data: { type: 'country', id: rel.toId.toString() },
      //     },
      //   };
      // });
    }

    return item;
  });
  const included2 = included.map(({ id, ...rest }) => {
    const item: ResourceObject<string, any> = {
      type: 'country',
      id: id.toString(),
    };
    if (rest) item.attributes = rest;
    return item;
  });
  const jsonApiDocument: JsonApiDocument = {
    data: data,
  };
  if (included2.length > 0) jsonApiDocument.included = included2;
  return jsonApiDocument;
}
