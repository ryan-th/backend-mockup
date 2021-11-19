// interfaces
import { EntitySet } from '../interfaces/entities';
import { EntitySetRelationship } from '../interfaces/relationships';

// data
import {
  academicSystems,
  defaultAcademicSystemPropertyNames,
} from './academicSystems';
import { cities, defaultCityPropertyNames } from './cities';
import { countries, defaultCountryPropertyNames } from './countries';
import { defaultSchoolPropertyNames, schools } from './schools';

// relationships
import { cityCountries } from './relationships/cityCountries';
import { schoolAcademicSystems } from './relationships/schoolAcademicSystems';
import { schoolCities } from './relationships/schoolCities';

// entitySets
export const entitySets: EntitySet[] = [
  {
    name: 'academicSystems',
    entityName: 'academicSystem',
    defaultPropertyNames: defaultAcademicSystemPropertyNames,
    data: academicSystems,
  },
  {
    name: 'cities',
    entityName: 'city',
    defaultPropertyNames: defaultCityPropertyNames,
    data: cities,
  },
  {
    name: 'countries',
    entityName: 'country',
    defaultPropertyNames: defaultCountryPropertyNames,
    data: countries,
  },
  {
    name: 'schools',
    entityName: 'school',
    defaultPropertyNames: defaultSchoolPropertyNames,
    data: schools,
  },
];

// relationships
export const entitySetRelationships: EntitySetRelationship[] = [
  {
    name: 'schoolAcademicSystems',
    fromEntityName: 'school',
    toEntityName: 'academicSystem',
    data: schoolAcademicSystems,
  },
  {
    name: 'schoolCities',
    fromEntityName: 'school',
    toEntityName: 'city',
    data: schoolCities,
  },
  {
    name: 'cityCountries',
    fromEntityName: 'city',
    toEntityName: 'country',
    data: cityCountries,
  },
];
