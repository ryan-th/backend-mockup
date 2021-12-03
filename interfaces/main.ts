import { EntitySet } from './entities';
import { EntitySetRelationship } from './relationships';

export interface ModuleData {
  entitySets: EntitySet[];
  entitySetRelationships: EntitySetRelationship[];
}

export interface Structure {
  entitySets: EntitySet[];
  entitySetRelationships: EntitySetRelationship[];
  addEntitySet: Function;
  addEntityRelationship: Function;
}
