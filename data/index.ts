// interfaces
import { EntitySet } from '../interfaces/entities';
import { EntitySetRelationship } from '../interfaces/relationships';

// entity-sets
import {
  academicSystems,
  defaultAcademicSystemPropertyNames,
} from './entity-sets/academicSystems';
import { cities, defaultCityPropertyNames } from './entity-sets/cities';
import {
  countries,
  defaultCountryPropertyNames,
} from './entity-sets/countries';
import { defaultSchoolPropertyNames, schools } from './entity-sets/schools';

// relationships
import { cityCountries } from './relationships/cityCountries';
import { schoolAcademicSystems } from './relationships/schoolAcademicSystems';
import { schoolCities } from './relationships/schoolCities';

// schemas
import { academicSystemQueryObjectSchema } from '../queries/schemas/academicSystems';
import { cityQueryObjectSchema } from '../queries/schemas/cities';
import { schoolQueryObjectSchema } from '../queries/schemas/schools';

// entitySets
export const entitySets: EntitySet[] = [
  {
    name: 'academicSystems',
    entityName: 'academicSystem',
    defaultPropertyNames: defaultAcademicSystemPropertyNames,
    data: academicSystems,
    querySchema: academicSystemQueryObjectSchema,
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
    sqlFrom:
      'INNER JOIN aSchoolAcademicSystems sas ON s.id = sas.schoolId INNER JOIN aAcademicSystems `as` ON sas.academicSystemId = `as`.id',
  },
  {
    name: 'schoolCities',
    fromEntityName: 'school',
    toEntityName: 'city',
    data: schoolCities,
    sqlFrom: 'INNER JOIN aCountries co ON ci.countryId = co.id',
  },
  {
    name: 'cityCountries',
    fromEntityName: 'city',
    toEntityName: 'country',
    data: cityCountries,
    sqlFrom: '',
  },
];
