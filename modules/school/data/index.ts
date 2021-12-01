// interfaces
import {
  EntityName,
  EntitySet,
  EntitySetName,
} from '../../../interfaces/entities';
import { EntitySetRelationship } from '../../../interfaces/relationships';

// entity-sets
import { defaultSchoolPropertyNames, schools } from './entity-sets/schools';

// relationships
// import { schoolAcademicSystems } from './relationships/schoolAcademicSystems';
// import { schoolCities } from './relationships/schoolCities';

// schemas
import { schoolQueryObjectSchema } from '../../../queries/schemas/schools';

// entitySets
export const entitySets: EntitySet[] = [
  {
    name: 'schools',
    entityName: 'school',
    allPropertyNames: ['TODO'],
    defaultPropertyNames: [], // defaultSchoolPropertyNames,
    data: schools,
    querySchema: schoolQueryObjectSchema,
  },
];

function getEntitySet(entitySetName: EntitySetName): EntitySet {
  return entitySets.find((x) => x.name === entitySetName);
}

// relationships
export const entitySetRelationships: EntitySetRelationship[] = [];
