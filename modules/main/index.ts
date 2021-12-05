import { structureService } from '../../shared/services/structureService';
import { regionalService } from './regional';
import { schoolService } from './school';

export const mainModuleService = {
  createStructure: createStructure,
};

function createStructure() {
  if (structureService.entitySets.length > 0) return;
  structureService.entitySets = [];
  structureService.entitySetRelationships = [];

  regionalService.createStructure();
  schoolService.createStructure();

  console.log('structureService', structureService);
}
