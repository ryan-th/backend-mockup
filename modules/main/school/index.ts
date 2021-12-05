import { AcademicSystem, School } from '../../../interfaces/entities';
import { structureService } from '../../../shared/services/structureService';
import { academicSystems } from './data/entity-sets/academicSystems';
import { schools } from './data/entity-sets/schools';
import { schoolAcademicSystems } from './data/relationships/schoolAcademicSystems';
import { schoolCities } from './data/relationships/schoolCities';
import { academicSystemQueryObjectSchema } from './query-schemas/academicSystems';
import { schoolQueryObjectSchema } from './query-schemas/schools';

export const schoolService = {
  createStructure: createStructure,
};

function createStructure() {
  // entities
  addAcademicSystem();
  addSchool();

  // relationships
  addSchoolAcademicSystems();
  addSchoolCities();
}

// entities
function addAcademicSystem() {
  const allPropertyNames: (keyof AcademicSystem)[] = ['name'];
  const defaultPropertyNames: (keyof AcademicSystem)[] = ['name'];

  structureService.addEntitySet(
    'academicSystems',
    'academicSystem',
    allPropertyNames,
    defaultPropertyNames,
    academicSystems,
    academicSystemQueryObjectSchema
  );
}

function addSchool() {
  const allPropertyNames: (keyof School)[] = [
    'name',
    'slug',
    'hasBeenVisitedByTh',
  ];
  const defaultPropertyNames: (keyof School)[] = ['name', 'slug'];

  structureService.addEntitySet(
    'schools',
    'school',
    allPropertyNames,
    defaultPropertyNames,
    schools,
    schoolQueryObjectSchema
  );
}

// relationships
function addSchoolAcademicSystems() {
  structureService.addEntitySetRelationship(
    'schoolAcademicSystems',
    'schools',
    'academicSystems',
    '1-many',
    'academicSystems',
    schoolAcademicSystems,
    'INNER JOIN aSchoolAcademicSystems sas ON s.id = sas.schoolId INNER JOIN aAcademicSystems `as` ON sas.academicSystemId = `as`.id'
  );
}

function addSchoolCities() {
  structureService.addEntitySetRelationship(
    'schoolCities',
    'schools',
    'cities',
    '1-1',
    'city',
    schoolCities,
    ''
  );
}
