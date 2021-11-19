import { Entity } from './interfaces/entities';
import { EntitySetRelationship } from './interfaces/relationships';

import { entitySetRelationships } from './data';

declare namespace FunctionLibrary {
  export type itemMap = (n: any) => any;

  export interface SortConfig<T> {
    key: keyof T;
    reverse?: boolean;
    map?: itemMap;
  }
}

export function getEntitySetRelationship(
  fromEntityName: string,
  toEntityName: string
): EntitySetRelationship {
  console.log(fromEntityName, toEntityName);
  return entitySetRelationships.find(
    (x) =>
      x.fromEntityName === fromEntityName && x.toEntityName === toEntityName
  );
}

export function entityPluck(entity: Entity, propertyNames: string[]): Entity {
  // plucks id and propertyNames from entity
  // { id: 1, foo: 2, bar: 3 }, ['id', 'bar'] => { id: 1, bar: 3 }
  const newEntity = { id: entity.id };
  propertyNames.forEach((propertyNames) => {
    newEntity[propertyNames] = entity[propertyNames];
  });
  return newEntity;
}

export function entitiesPluck(
  entities: Entity[],
  propertyNames: string[]
): Entity[] {
  // plucks id and propertyNames from each entity
  return entities.map((entity) => {
    return entityPluck(entity, propertyNames);
  });
}

export function compareFnGenerator<T extends object>(
  keys: (keyof T | FunctionLibrary.SortConfig<T>)[]
): (a: T, b: T) => 0 | 1 | -1 {
  // use to generate a compare function for sorting
  // based on: https://stackoverflow.com/a/56192318 (improved)
  // e.g. foos.sort(compareFnGenerator<Bar.Foo>(['baz', { key: 'qux', reverse: true }]));
  // e.g. foos.sort(compareFnGenerator<Bar.Foo>([{ key: 'quux', map: (x: number) => (x === -1)]));
  const _this = this;
  return function (a: T, b: T) {
    const firstKey: keyof T | FunctionLibrary.SortConfig<T> = keys[0];
    const isSimple = typeof firstKey === 'string';
    const key: keyof T = isSimple
      ? (firstKey as keyof T)
      : (firstKey as FunctionLibrary.SortConfig<T>).key;
    const reverse: boolean = isSimple
      ? false
      : !!(firstKey as FunctionLibrary.SortConfig<T>).reverse;
    const map: FunctionLibrary.itemMap | null = isSimple
      ? null
      : (firstKey as FunctionLibrary.SortConfig<T>).map || null;

    const valA = map ? map(a[key]) : a[key];
    const valB = map ? map(b[key]) : b[key];

    if (valA > valB) return reverse ? -1 : 1;
    if (valA < valB) return reverse ? 1 : -1;
    if (keys.length === 1) return 0;
    return _this.compareFnGenerator(keys.slice(1))(a, b);
  };
}
