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
import { cityQueryObjectSchema } from '../queries/schemas/cities';
import { schoolQueryObjectSchema } from '../queries/schemas/schools';

// entitySets
export const entitySets: EntitySet[] = [
  {
    name: 'academicSystems',
    entityName: 'academicSystem',
    defaultPropertyNames: defaultAcademicSystemPropertyNames,
    data: academicSystems,
    // TODO
    querySchema: null,
  },
  {
    name: 'cities',
    entityName: 'city',
    defaultPropertyNames: defaultCityPropertyNames,
    data: cities,
    querySchema: cityQueryObjectSchema,
  },
  {
    name: 'countries',
    entityName: 'country',
    defaultPropertyNames: defaultCountryPropertyNames,
    data: countries,
    // TODO
    querySchema: null,
  },
  {
    name: 'schools',
    entityName: 'school',
    defaultPropertyNames: defaultSchoolPropertyNames,
    data: schools,
    querySchema: schoolQueryObjectSchema,
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
