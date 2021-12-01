// interfaces
import {
  EntityName,
  EntitySet,
  EntitySetName,
} from '../../../interfaces/entities';
import { EntitySetRelationship } from '../../../interfaces/relationships';

// entity-sets
import { cities, defaultCityPropertyNames } from './entity-sets/cities';
import {
  allCountryPropertyNames,
  countries,
  defaultCountryPropertyNames,
} from './entity-sets/countries';
// import { defaultSchoolPropertyNames, schools } from './entity-sets/schools';

// relationships
import { cityCountries } from './relationships/cityCountries';

// schemas
import { cityQueryObjectSchema } from '../queries/schemas/cities';
import { regions } from './entity-sets/regions';

// entitySets
export const entitySets: EntitySet[] = [
  {
    name: 'cities',
    entityName: 'city',
    allPropertyNames: ['TODO'],
    defaultPropertyNames: defaultCityPropertyNames,
    data: cities,
    querySchema: cityQueryObjectSchema,
  },
  {
    name: 'countries',
    entityName: 'country',
    allPropertyNames: allCountryPropertyNames,
    defaultPropertyNames: defaultCountryPropertyNames,
    data: countries,
    // TODO
    querySchema: null,
  },
  {
    name: 'regions',
    entityName: 'region',
    allPropertyNames: ['TODO'],
    defaultPropertyNames: defaultCountryPropertyNames,
    data: regions,
    // TODO
    querySchema: null,
  },
  // {
  //   name: 'schools',
  //   entityName: 'school',
  //   allPropertyNames: ['TODO'],
  //   defaultPropertyNames: defaultSchoolPropertyNames,
  //   data: schools,
  //   querySchema: schoolQueryObjectSchema,
  // },
];

function getEntitySet(entitySetName: EntitySetName): EntitySet {
  return entitySets.find((x) => x.name === entitySetName);
}

// relationships
export const entitySetRelationships: EntitySetRelationship[] = [
  {
    name: 'cityCountries',
    fromEntitySet: getEntitySet('cities'),
    toEntitySet: getEntitySet('countries'),
    data: cityCountries,
    sqlFrom: '',
  },
];

console.log(12, cities, cityCountries, countries);

// add properties to city to help with filtering

function addRelatedPropertiesToEntity(rel: EntitySetRelationship) {
  console.log(13);
  rel.fromEntitySet?.data.forEach((item) => {
    const toId = rel.data.find((x) => x.fromId == item.id)?.toId;
    const toEntity = rel.toEntitySet.data.find((co) => co.id == toId);
    if (!toEntity) return;
    rel.toEntitySet.allPropertyNames.forEach((propertyName) => {
      item[rel.toEntitySet.entityName + '.' + propertyName] =
        toEntity[propertyName];
    });
  });
  console.log(14);
}

// const rel = entitySetRelationships.find((x) => x.name === 'cityCountries');
// entitySetRelationships.forEach(rel => addRelatedPropertiesToEntity(rel));
entitySetRelationships.forEach(addRelatedPropertiesToEntity);
// addRelatedPropertiesToEntity(rel);

console.log(15, cities);
