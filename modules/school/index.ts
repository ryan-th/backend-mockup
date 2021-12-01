import { EntitySet } from '../../interfaces/entities';
import { QueryPath } from '../../interfaces/queries';
import { getResponseFromRequest$ } from '../../services/mainService';
import { entitySets } from './data';

// TODO move
export interface ModuleData {
  entitySets: EntitySet[];
}

export const schoolModuleData: ModuleData = {
  entitySets: entitySets,
};

// export const schoolService = {
//   getResponseFromRequest$: foo,
// };

// function foo(queryPath: QueryPath) {
//   console.log(22);
//   return getResponseFromRequest$(moduleData, queryPath);
// }
