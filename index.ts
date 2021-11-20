import { forkJoin, combineLatest, fromEvent, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// interfaces
import { City, Entity, EntityName, EntitySet } from './interfaces/entities';
import {
  EntityRelationship,
  EntitySetRelationshipName,
} from './interfaces/relationships';
import { Query, QueryObject } from './interfaces/queries';

// data
import { entitySetRelationships, entitySets } from './data';
import { queries } from './queries/index';

// services
import {
  getEntitySetRelationship,
  entitiesPluck,
  compareFnGenerator,
} from './services/dataService';
import {
  isMatch_listIncludes,
  isMatch_stringMatches,
} from './services/filterService';
import {
  deriveQueryFromQueryPath,
  isAcademicSystemQueryObject,
  isCityQueryObject,
  isCountryQueryObject,
  isSchoolQueryObject,
  validateQuery,
} from './services/queryService';

// tests
import { runTests } from './tests';

// let select: HTMLSelectElement;
let input: HTMLInputElement;
let pre: HTMLPreElement;
let response$: Observable<any>;
let requestButtonClick$: Observable<Event>;

(function main() {
  // TEMP
  runTests();

  setHtml();
  setObservables();

  response$.subscribe((response) => {
    console.log('response:', response);
  });
})();

function setHtml() {
  const select = <HTMLSelectElement>document.getElementById('querySlugs');
  const label = <HTMLSelectElement>document.getElementById('queryDescription');
  input = <HTMLInputElement>document.getElementById('queryPath');
  const requestButton = <HTMLButtonElement>(
    document.getElementById('requestButton')
  );
  const clearButton = <HTMLButtonElement>document.getElementById('clearButton');
  pre = <HTMLPreElement>document.getElementById('response');

  queries.forEach((query, i) => {
    var option = document.createElement('option');
    option.innerText = query.slug;
    select.appendChild(option);
  });

  setValuesToSelectedQueryPath();

  function setValuesToSelectedQueryPath() {
    const querySlug = select.options[select.selectedIndex].innerText;
    const query = queries.find((x) => x.slug === querySlug);
    label.hidden = true;
    if (query.description) {
      label.hidden = false;
      label.innerText = query.description;
    }
    input.value = query.path;
  }

  function clearResponseAndConsole() {
    pre.innerText = '';
    console.clear();
  }

  function setValuesToCustomQuery() {
    select.selectedIndex = -1;
    label.hidden = false;
    label.innerText = 'Custom query';
  }

  fromEvent(select, 'change')
    .pipe(map(() => setValuesToSelectedQueryPath()))
    .subscribe();

  fromEvent(input, 'keydown').pipe(map(setValuesToCustomQuery)).subscribe();

  requestButtonClick$ = fromEvent(requestButton, 'click');

  fromEvent(clearButton, 'click')
    .pipe(map(clearResponseAndConsole))
    .subscribe();
}

function setObservables() {
  const request$ = requestButtonClick$.pipe(
    map(() => {
      const queryPath = input.value;
      return queryPath;
    })
  );

  const deriveQuery$ = (queryPath) => {
    console.log('queryPath:', queryPath);
    const query = deriveQueryFromQueryPath(queryPath);
    return combineLatest([of(query)]);
  };

  const validateQuery$ = ([query]) => {
    console.log('query:', query);
    const queryErrors = validateQuery(query);
    query.isValidObject = !queryErrors;
    query.errors = queryErrors;
    return combineLatest([of(query), of(queryErrors)]);
  };

  const getList$ = ([query, queryErrors]) => {
    console.log('queryErrors:', queryErrors);
    const list$ = getList(query);
    return combineLatest([of(query), list$]);
  };

  const deriveListIds$ = ([query, list]) => {
    console.log('list:', list);
    const listIds = deriveListIds(list);
    return combineLatest([of(query), of(list), of(listIds)]);
  };
  const getListRelationships$ = ([query, list, listIds]) => {
    console.log('listIds:', listIds);
    const relationships$ = getListRelationships(query, listIds);
    return combineLatest([of(query), of(list), of(listIds), relationships$]);
  };

  const getIncluded$ = ([query, list, listIds, relationships]) => {
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

  const deriveJsonApi = ([query, list, listIds, relationships, included]) => {
    console.log('included:', included);
    // TODO: construct correct jsonApi
    const jsonApi = {
      isValidRequest: query.isValidObject,
      errors: query.errors,
      list: list,
      relationships: relationships,
      included: included,
    };
    pre.innerText = JSON.stringify(jsonApi, null, 2);
    return {
      query: query,
      list: list,
      listIds: listIds,
      relationships: relationships,
      included: included,
    };
  };

  response$ = request$.pipe(
    // https://medium.com/@snorredanielsen/rxjs-accessing-a-previous-value-further-down-the-pipe-chain-b881026701c1 - approach 2 (plus comment 1; plus later rxjs version)
    switchMap(deriveQuery$),
    switchMap(validateQuery$),
    switchMap(getList$),
    switchMap(deriveListIds$),
    switchMap(getListRelationships$),
    switchMap(getIncluded$),
    map(deriveJsonApi)
  );
}

// function deriveSubQuery(query: Query, entityName: string): Query {
//   // TODO: utilise; derive rather than hard-code
//   if (entityName === 'city') return queries[1];
// }

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

function deriveListIds(entitySet: EntitySet): number[] {
  if (entitySet == null) return [];
  return entitySet.data.map((x) => x.id);
}

function getListRelationships(
  query: Query,
  listIds: number[]
): Observable<Record<EntityName, EntityRelationship[]> | {}> {
  // TODO: consider this returning all 'relationships' AND 'included'
  if (!query.isValidObject) return of({});

  const relationships: Record<string, Observable<EntityRelationship[]>> = {};
  const fromEntityName = query.object.type;

  query.object.include?.forEach((toEntityName) => {
    console.log(111, toEntityName);
    if (toEntityName.includes('.')) return;

    const listRelationship = getEntitySetRelationship(
      fromEntityName,
      toEntityName
    );
    console.log(99, listRelationship);
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

function getIncluded(
  query: Query,
  listIds: number[],
  relationships: Record<EntitySetRelationshipName, EntityRelationship[]>
): Observable<Entity[]> {
  let set = [];
  const qo = query.object;

  if (!query.isValidObject) return of(null);

  console.log(555, qo, relationships, Object.keys(relationships));

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
    console.log(333, entitySet, listRelationship.toEntityName, fieldNames);
    subset = entitiesPluck(subset, fieldNames);

    const children = qo.include.filter((x) =>
      x.startsWith(listRelationship.toEntityName + '.')
    );

    console.log(77, children, query);

    console.log(
      222,
      key,
      subset.map((x) => x.id)
    );
    set = [...set, ...subset];
  });

  return of(set);
}
