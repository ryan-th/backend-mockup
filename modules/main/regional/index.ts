// interfaces
import { City, Country, Region } from '../../../interfaces/entities';

// entity-sets
import { cities } from './data/entity-sets/cities';
import { countries } from './data/entity-sets/countries';

// relationships
import { cityCountries } from './data/relationships/cityCountries';

// schemas
import { cityQueryObjectSchema } from './query-schemas/cities';
import { regions } from './data/entity-sets/regions';
import { structureService } from '../../../shared/services/structureService';
import { countryRegions } from './data/relationships/countryRegions';

export const regionalService = {
  createStructure: createStructure,
};

function createStructure() {
  // entities
  addCity();
  addCountry();
  addRegion();

  // relationships
  addCountryRegions();
  addCityCountries();
}

// entities
function addCity() {
  const allPropertyNames: (keyof City)[] = ['name', 'slug', 'imageUrl'];
  const defaultPropertyNames: (keyof City)[] = ['name', 'slug'];
  structureService.addEntitySet(
    'cities',
    'city',
    allPropertyNames,
    defaultPropertyNames,
    cities,
    cityQueryObjectSchema
  );
}

function addCountry() {
  const allPropertyNames: (keyof Country)[] = ['id', 'name', 'slug'];
  const defaultPropertyNames: (keyof Country)[] = ['name', 'slug'];
  structureService.addEntitySet(
    'countries',
    'country',
    allPropertyNames,
    defaultPropertyNames,
    countries,
    // countryQueryObjectSchema
    null
  );
}

function addRegion() {
  const allPropertyNames: (keyof Region)[] = ['name', 'slug'];
  const defaultPropertyNames: (keyof Region)[] = ['name', 'slug'];
  structureService.addEntitySet(
    'regions',
    'region',
    allPropertyNames,
    defaultPropertyNames,
    regions,
    // regionQueryObjectSchema
    null
  );
}

// relationships
function addCityCountries() {
  structureService.addEntitySetRelationship(
    'cityCountries',
    'cities',
    'countries',
    '1-1',
    'country',
    cityCountries,
    ''
  );
}

function addCountryRegions() {
  structureService.addEntitySetRelationship(
    'countryRegions',
    'countries',
    'regions',
    '1-1',
    'region',
    countryRegions,
    ''
  );
}

// const entitySetRelationships: EntitySetRelationship[] = [];

// entitySets
// const entitySets: EntitySet[] = [
//   {
//     name: 'cities',
//     entityName: 'city',
//     allPropertyNames: allCityPropertyNames,
//     defaultPropertyNames: defaultCityPropertyNames,
//     data: cities,
//     querySchema: cityQueryObjectSchema,
//   },
//   {
//     name: 'countries',
//     entityName: 'country',
//     allPropertyNames: allCountryPropertyNames,
//     defaultPropertyNames: defaultCountryPropertyNames,
//     data: countries,
//     // TODO
//     querySchema: null,
//   },
//   {
//     name: 'regions',
//     entityName: 'region',
//     allPropertyNames: ['TODO'],
//     defaultPropertyNames: defaultRegionPropertyNames,
//     data: regions,
//     // TODO
//     querySchema: null,
//   },
// {
//   name: 'schools',
//   entityName: 'school',
//   allPropertyNames: ['TODO'],
//   defaultPropertyNames: defaultSchoolPropertyNames,
//   data: schools,
//   querySchema: schoolQueryObjectSchema,
// },
// ];

// function getEntitySet(entitySetName: EntitySetName): EntitySet {
//   return entitySets.find((x) => x.name === entitySetName);
// }

// relationships
// function addEntitySet() {}

// function addRelationship(
//   name: EntitySetRelationshipName,
//   fromEntityName: EntitySetName,
//   toEntityName: EntitySetName,
//   data: EntityRelationship[],
//   sqlFrom: string
// ) {
//   const fromEntitySet = getEntitySet(fromEntityName);
//   const toEntitySet = getEntitySet(toEntityName);
//   entitySetRelationships.push({
//     name: name,
//     fromEntitySet: fromEntitySet,
//     toEntitySet: toEntitySet,
//     data: data,
//     sqlFrom: sqlFrom,
//   });
// }

// addRelationship('cityCountries', 'cities', 'countries', cityCountries, '');

// add properties to city to help with filtering

// function addRelatedPropertiesToEntity(rel: EntitySetRelationship) {
//   console.log(13);
//   rel.fromEntitySet?.data.forEach((item) => {
//     const toId = rel.data.find((x) => x.fromId == item.id)?.toId;
//     const toEntity = rel.toEntitySet.data.find((co) => co.id == toId);
//     if (!toEntity) return;
//     rel.toEntitySet.allPropertyNames.forEach((propertyName) => {
//       item[rel.toEntitySet.entityName + '.' + propertyName] =
//         toEntity[propertyName];
//     });
//   });
//   console.log(14);
// }

// const rel = entitySetRelationships.find((x) => x.name === 'cityCountries');
// entitySetRelationships.forEach(rel => addRelatedPropertiesToEntity(rel));
// entitySetRelationships.forEach(addRelatedPropertiesToEntity);
// addRelatedPropertiesToEntity(rel);

// export const regionalStructureService = {
//   entitySets: entitySets,
//   entitySetRelationships: entitySetRelationships,
//   getEntitySet: getEntitySet,
// };
