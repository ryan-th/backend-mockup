// rxjs
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// interfaces
import { City, Entity, EntityName, EntitySet } from '../interfaces/entities';
import {
  Query,
  QueryObject,
  QueryObjectPage,
  QueryPath,
} from '../interfaces/queries';
import {
  EntityRelationship,
  EntitySetRelationshipName,
} from '../interfaces/relationships';

// data
// import { entitySetRelationships } from '../data';

// services
import {
  compareFnGenerator,
  entitiesPluck,
  getEntitySetRelationship,
} from './dataService';
import {
  isMatch_entitySetIncludes,
  isMatch_stringMatches,
} from './filterService';
import {
  deriveQueryFromQueryPath,
  isAcademicSystemQueryObject,
  isCityQueryObject,
  isCountryQueryObject,
  isRegionQueryObject,
  isSchoolQueryObject,
  validateQuery,
} from './queryService';
import { JsonApiDocument, JsonApiErrorObject } from '../interfaces/responses';
import {
  PrimaryData,
  ResourceObject,
} from '../interfaces/3rd-party/jsonapi-typescript';
import { ModuleData } from '../interfaces/main';
import { allCountryPropertyNames } from '../modules/regional/data/entity-sets/countries';
// import { allCountryPropertyNames } from '../data/entity-sets/countries';
// import { ModuleData } from '../modules/school';

// TODO: consider renaming to getJsonApiResponseFromQueryPath?
export function getResponseFromRequest$(
  moduleData: ModuleData,
  queryPath: QueryPath
): Observable<JsonApiDocument> {
  const deriveQuery$ = (queryPath: QueryPath) => {
    console.log('queryPath:', queryPath);
    const query = deriveQueryFromQueryPath(moduleData.entitySets, queryPath);
    return combineLatest([of(moduleData), of(query)]);
  };

  const validateQuery$ = ([moduleData, query]: [ModuleData, Query]) => {
    console.log('query:', query, JSON.stringify(query));
    console.log(24);
    const queryErrors = validateQuery(moduleData, query);
    console.log(25);
    query.isValidObject = !queryErrors;
    query.errors = queryErrors;
    return combineLatest([of(moduleData), of(query), of(queryErrors)]);
  };

  const getEntitySet$ = ([moduleData, query, queryErrors]: [
    ModuleData,
    Query,
    JsonApiErrorObject[]
  ]) => {
    console.log('queryErrors:', queryErrors);
    const entitySet$ = getEntitySet(moduleData, query);
    return combineLatest([of(moduleData), of(query), entitySet$]);
  };

  const deriveEntitySetIds$ = ([moduleData, query, entitySet]: [
    ModuleData,
    Query,
    EntitySet
  ]) => {
    console.log('entitySet:', entitySet);
    const entitySetIds = deriveEntitySetIds(entitySet);
    return combineLatest([
      of(moduleData),
      of(query),
      of(entitySet),
      of(entitySetIds),
    ]);
  };

  const getEntitySetRelationships$ = ([
    moduleData,
    query,
    entitySet,
    entitySetIds,
  ]: [ModuleData, Query, EntitySet, number[]]) => {
    console.log('entitySetIds:', entitySetIds);
    const relationships$ = getEntitySetRelationships(query, entitySetIds);
    return combineLatest([
      of(moduleData),
      of(query),
      of(entitySet),
      of(entitySetIds),
      relationships$,
    ]);
  };

  const getIncluded$ = ([
    moduleData,
    query,
    entitySet,
    entitySetIds,
    relationships,
  ]: [
    ModuleData,
    Query,
    EntitySet,
    number[],
    {} | Record<EntityName, EntityRelationship[]>
  ]) => {
    console.log('relationships:', relationships);
    const included$ = getIncluded(
      moduleData,
      query,
      entitySetIds,
      relationships
    );
    return combineLatest([
      of(moduleData),
      of(query),
      of(entitySet),
      of(entitySetIds),
      of(relationships),
      included$,
    ]);
  };

  const deriveJsonApi$ = ([
    moduleData,
    query,
    entitySet,
    entitySetIds,
    relationships,
    included,
  ]: [
    ModuleData,
    Query,
    EntitySet,
    number[],
    {} | Record<EntityName, EntityRelationship[]>,
    Entity[]
  ]): Observable<JsonApiDocument> => {
    console.log('included:', included);
    const jsonApi = deriveJsonApi(
      moduleData,
      query,
      entitySet,
      relationships,
      included
    );
    return of(jsonApi);
  };

  // https://medium.com/@snorredanielsen/rxjs-accessing-a-previous-value-further-down-the-pipe-chain-b881026701c1 - approach 2 (plus comment 1; plus later rxjs version)
  return of(queryPath).pipe(
    switchMap(deriveQuery$),
    switchMap(validateQuery$),
    switchMap(getEntitySet$),
    switchMap(deriveEntitySetIds$),
    switchMap(getEntitySetRelationships$),
    switchMap(getIncluded$),
    switchMap(deriveJsonApi$)
  );
}

// function deriveSubQuery(query: Query, entityName: string): Query {
//   // TODO: utilise; derive rather than hard-code
//   if (entityName === 'city') return queries[1];
// }

function sortData(data: Entity[], sort: string[]): Entity[] {
  if (sort?.length > 0) {
    const adaptedSort = sort.map((x) =>
      x.startsWith('-') ? { key: x.slice(1), reverse: true } : x
    );
    return data.sort(compareFnGenerator<any>(adaptedSort));
  }
  return data;
}

function pageData(data: Entity[], page: QueryObjectPage): Entity[] {
  const pageSize = page?.size;
  if (pageSize) {
    const pageNumber = page?.number || 1;
    const from = (pageNumber - 1) * pageSize;
    return data.slice(from, from + pageSize);
  }
  return data;
}

// TODO: move higher
function getEntitySet(
  moduleData: ModuleData,
  query: Query
): Observable<EntitySet> {
  // TODO: gradually improve matching to query
  const qo: QueryObject = query.object;
  let entitySet: EntitySet;

  if (!query.isValidObject) return of(null);

  entitySet = { ...moduleData.entitySets.find((x) => x.entityName == qo.type) };

  if (isAcademicSystemQueryObject(qo)) {
    let data = entitySet.data;
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_entitySetIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    entitySet.data = data;
  }

  if (isCityQueryObject(qo)) {
    let data = entitySet.data;

    // console.log(777, data);

    // filtering; TODO: move higher
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_entitySetIncludes(x.id, qo.filter.id?.in)) return false;

      // TODO: make more generic; move to function
      const esi = isMatch_entitySetIncludes;
      const isMatch = allCountryPropertyNames.every((p) =>
        esi(x[`country.${p}`], qo.filter[`country.${p}`]?.in)
      );
      if (!isMatch) return false;

      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;

      return true;
    });

    data = sortData(data, qo.sort);
    data = pageData(data, qo.page);

    entitySet.data = data;
  }

  if (isCountryQueryObject(qo)) {
    // entitySet.data = entitySet.data.filter((x) =>
    //   qo.filter?.id?.includes(x['id'])
    // );
    let data = entitySet.data;
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_entitySetIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    data = sortData(data, qo.sort);
    data = pageData(data, qo.page);

    entitySet.data = data;
  }

  if (isRegionQueryObject(qo)) {
    // entitySet.data = entitySet.data.filter((x) =>
    //   qo.filter?.id?.includes(x['id'])
    // );
    let data = entitySet.data;
    data = data.filter((x: City) => {
      if (!qo.filter) return true;
      if (!isMatch_entitySetIncludes(x.id, qo.filter.id?.in)) return false;
      if (!isMatch_stringMatches(x.name, qo.filter.name?.matches)) return false;
      return true;
    });

    data = sortData(data, qo.sort);
    data = pageData(data, qo.page);

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
      if (!isMatch_entitySetIncludes(x.id, qo.filter.id?.in)) return false;
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
function deriveEntitySetIds(entitySet: EntitySet): number[] {
  if (entitySet == null) return [];
  return entitySet.data.map((x) => x.id);
}

// TODO: move higher
function getEntitySetRelationships(
  query: Query,
  entitySetIds: number[]
): Observable<Record<EntityName, EntityRelationship[]> | {}> {
  // TODO: consider this returning all 'relationships' AND 'included'
  if (!query.isValidObject) return of({});

  const relationships: Record<string, Observable<EntityRelationship[]>> = {};
  const fromEntityName = query.object.type;

  query.object.include?.forEach((toEntityName) => {
    // console.log(111, toEntityName);
    if (toEntityName.includes('.')) return;

    const entitySetRelationship = getEntitySetRelationship(
      fromEntityName,
      toEntityName
    );
    // console.log(99, entitySetRelationship);
    // const subQuery = deriveSubQuery(query, entityName);
    const filteredRelationship = entitySetRelationship.data.filter((x) =>
      entitySetIds.includes(x.fromId)
    );
    relationships[entitySetRelationship.name] = of(filteredRelationship);
  });

  return Object.keys(relationships).length === 0
    ? of({})
    : forkJoin(relationships);
}

// TODO: move higher
function getIncluded(
  moduleData: ModuleData,
  query: Query,
  entitySetIds: number[],
  relationships: Record<EntitySetRelationshipName, EntityRelationship[]> | {}
): Observable<Entity[]> {
  let set = [];
  const qo = query.object;
  const entityRelationships = relationships;

  if (!query.isValidObject) return of(null);

  // console.log(555, qo, relationships, Object.keys(relationships));

  Object.keys(entityRelationships).forEach((entitySetRelationshipName) => {
    const entitySetRelationship = moduleData.entitySetRelationships.find(
      (x) => x.name === entitySetRelationshipName
    );
    const entitySet = moduleData.entitySets.find(
      (x) => x.entityName === entitySetRelationship.toEntitySet.entityName
    );
    const toIds = [
      ...new Set(
        entityRelationships[entitySetRelationshipName].map((x) => x.toId)
      ),
    ];
    let subset = entitySet.data.filter((x) => toIds.includes(x.id));

    // pluck requested fields
    const fieldNames: string[] =
      qo.fields?.[entitySetRelationship.toEntitySet.entityName] ||
      entitySet.defaultPropertyNames;
    // console.log(333, entitySet, entitySetRelationship.toEntityName, fieldNames);
    subset = entitiesPluck(subset, fieldNames);
    subset.forEach((x) => (x['type'] = entitySet.entityName));

    const children = qo.include.filter((x) =>
      x.startsWith(entitySetRelationship.toEntitySet.entityName + '.')
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
  moduleData: ModuleData,
  query: Query,
  entitySet: EntitySet,
  relationships: {} | Record<EntityName, EntityRelationship[]>,
  included: Entity[]
): JsonApiDocument {
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

    Object.keys(relationships).forEach((key) => {
      if (!item.relationships) item.relationships = {};

      const entitySetRelationship = moduleData.entitySetRelationships.find(
        (x) => x.name === key
      );

      const entityRelationship = relationships[key]?.find(
        (rel: EntityRelationship) => id === rel.fromId
      );
      if (entityRelationship) {
        item.relationships[entitySetRelationship.toEntitySet.entityName] = {
          data: {
            type: entitySetRelationship.toEntitySet.entityName,
            id: entityRelationship.toId.toString(),
          },
        };
      }
    });

    return item;
  });
  const included2 = included.map(({ id, type, ...rest }) => {
    const item: ResourceObject<string, any> = {
      type: type,
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
