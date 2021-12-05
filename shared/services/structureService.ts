import { JSONSchema7 } from 'json-schema';
import {
  Entity,
  EntityName,
  EntitySet,
  EntitySetName,
} from '../../interfaces/entities';
import {
  EntityRelationship,
  EntitySetRelationship,
  EntitySetRelationshipName,
  EntitySetRelationshipType,
} from '../../interfaces/relationships';

export const structureService: {
  addEntitySet: typeof addEntitySet;
  addEntitySetRelationship: typeof addEntitySetRelationship;
  entitySets: EntitySet[];
  entitySetRelationships: EntitySetRelationship[];
  getEntitySet: (entitySetName: EntitySetName) => EntitySet;
  getEntitySetRelationship: typeof getEntitySetRelationship;
} = {
  addEntitySet: addEntitySet,
  addEntitySetRelationship: addEntitySetRelationship,
  entitySets: [],
  entitySetRelationships: [],
  getEntitySet: getEntitySet,
  getEntitySetRelationship: getEntitySetRelationship,
};

function addEntitySet(
  name: EntitySetName,
  entityName: EntityName,
  allPropertyNames: string[],
  defaultPropertyNames: string[],
  data: Entity[],
  querySchema: JSONSchema7
) {
  const entitySet: EntitySet = {
    name: name,
    entityName: entityName,
    allPropertyNames: allPropertyNames,
    defaultPropertyNames: defaultPropertyNames,
    data: data,
    querySchema: querySchema,
  };
  structureService.entitySets.push(entitySet);
}

function getEntitySet(entitySetName: EntitySetName): EntitySet {
  return structureService.entitySets.find((x) => x.name === entitySetName);
}

function getEntitySetFromEntityName(entityName: EntityName): EntitySet {
  return structureService.entitySets.find((x) => x.entityName === entityName);
}

function getEntitySetRelationship(
  fromEntitySetName: EntitySetName,
  toEntitySetName: EntitySetName
): EntitySetRelationship {
  return structureService.entitySetRelationships.find(
    (x) =>
      x.fromEntitySet.name === fromEntitySetName &&
      x.toEntitySet.name === toEntitySetName
  );
}

function addEntitySetRelationship(
  name: EntitySetRelationshipName,
  fromEntityName: EntitySetName,
  toEntityName: EntitySetName,
  relationshipType: EntitySetRelationshipType,
  includeName: string,
  data: EntityRelationship[],
  sqlFrom: string
) {
  const fromEntitySet = getEntitySet(fromEntityName);
  const toEntitySet = getEntitySet(toEntityName);
  const rel: EntitySetRelationship = {
    name: name,
    fromEntitySet: fromEntitySet,
    toEntitySet: toEntitySet,
    relationshipType: relationshipType,
    includeName: includeName,
    data: data,
    sqlFrom: sqlFrom,
  };
  fromEntitySet.relationships = fromEntitySet.relationships || [];
  fromEntitySet.relationships.push(rel);
  structureService.entitySetRelationships.push(rel);
  addRelatedPropertiesToEntity(rel);
}

function addRelatedPropertiesToEntity(rel: EntitySetRelationship) {
  // console.log(13);
  rel.fromEntitySet?.data.forEach((item) => {
    const toId = rel.data.find((x) => x.fromId == item.id)?.toId;
    const toEntity = rel.toEntitySet.data.find((co) => co.id == toId);
    if (!toEntity) return;
    rel.toEntitySet.allPropertyNames.forEach((propertyName) => {
      item[rel.toEntitySet.entityName + '.' + propertyName] =
        toEntity[propertyName];
    });
  });
}
