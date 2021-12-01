import { EntitySet } from './entities';
import { EntitySetRelationship } from './relationships';

export interface ModuleData {
  entitySets: EntitySet[];
  entitySetRelationships: EntitySetRelationship[];
}
