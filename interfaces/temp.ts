// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
const user: User = { age: 11, id: '3', name: 'Foo' };

/*
type User = {
  id: string;
  name: string;
  age: number;
}
*/

type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]?: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
const foo: LazyPerson = { getAge: () => 7 };
foo.getAge();

//

export interface City {
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface Country {
  name: string;
  slug: string;
}

export interface FilterOperator {
  matches?: string;
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  in?: number[] | string[] | boolean[];
}

type FiltersForType<Type, prefix extends string = ''> = {
  [Property in keyof Type as `${prefix}${string & Property}`]?: FilterOperator;
};

export interface CityQueryObject {
  filter?: FiltersForType<City> & FiltersForType<Country, 'cofffuntry.'>;
}

const cityQueryObject: CityQueryObject = {
  filter: { name: { matches: 'foo' } },
};

// cityQueryObject.filter["country.name"]
