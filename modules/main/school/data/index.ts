// // interfaces
// import {
//   AcademicSystem,
//   EntitySet,
//   EntitySetName,
//   School,
// } from '../../../interfaces/entities';
// import { EntitySetRelationship } from '../../../interfaces/relationships';

// // entity-sets
// import { academicSystems } from './entity-sets/academicSystems';
// import { schools } from './entity-sets/schools';

// // relationships
// import { schoolAcademicSystems } from './relationships/schoolAcademicSystems';
// import { schoolCities } from './relationships/schoolCities';

// // schemas
// import { schoolQueryObjectSchema } from '../queries/schemas/schools';
// import { academicSystemQueryObjectSchema } from '../queries/schemas/academicSystems';

// // entitySets
// const allAcademicSystemPropertyNames: (keyof AcademicSystem)[] = ['name'];
// const defaultAcademicSystemPropertyNames: (keyof AcademicSystem)[] = ['name'];

// const allSchoolPropertyNames: (keyof School)[] = [
//   'name',
//   'slug',
//   'hasBeenVisitedByTh',
// ];
// const defaultSchoolPropertyNames: (keyof School)[] = ['name', 'slug'];

// export const entitySets: EntitySet[] = [
//   {
//     name: 'academicSystems',
//     entityName: 'academicSystem',
//     allPropertyNames: allAcademicSystemPropertyNames,
//     defaultPropertyNames: defaultAcademicSystemPropertyNames,
//     data: academicSystems,
//     querySchema: academicSystemQueryObjectSchema,
//   },
//   {
//     name: 'schools',
//     entityName: 'school',
//     allPropertyNames: allSchoolPropertyNames,
//     defaultPropertyNames: defaultSchoolPropertyNames,
//     data: schools,
//     querySchema: schoolQueryObjectSchema,
//   },
// ];

// function getEntitySet(entitySetName: EntitySetName): EntitySet {
//   return entitySets.find((x) => x.name === entitySetName);
// }

// // relationships
// export const entitySetRelationships: EntitySetRelationship[] = [
//   {
//     name: 'schoolAcademicSystems',
//     fromEntitySet: getEntitySet('schools'),
//     toEntitySet: getEntitySet('academicSystems'),
//     data: schoolAcademicSystems,
//     sqlFrom:
//       'INNER JOIN aSchoolAcademicSystems sas ON s.id = sas.schoolId INNER JOIN aAcademicSystems `as` ON sas.academicSystemId = `as`.id',
//   },
//   {
//     name: 'schoolCities',
//     fromEntitySet: getEntitySet('schools'),
//     toEntitySet: getEntitySet('cities'),
//     data: schoolCities,
//     sqlFrom: 'INNER JOIN aCountries co ON ci.countryId = co.id',
//   },
// ];
