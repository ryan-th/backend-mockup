import { fromEvent, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  getQueryStatusColor,
  queries,
} from './modules/stackblitz-core/queries/index';
import {
  // getModuleDataForQueryPath,
  getResponseFromRequest$,
} from './shared/services/mainService';
import { structureService } from './shared/services/structureService';
import { mainModuleService } from './modules/main';
import { testService } from './shared/services/tests/testService';

let input: HTMLInputElement;
let pre: HTMLPreElement;
let requestButtonClick$: Observable<Event>;
let response$: Observable<any>;

(function main() {
  // TEMP
  // runTests();

  console.log(100);
  const foo = structureService;
  console.log(101, foo);

  setHtml();
  setObservables();

  response$.subscribe((jsonApiResponse) => {
    pre.innerText = JSON.stringify(jsonApiResponse, null, 2);
  });
})();

function setHtml() {
  const select = <HTMLSelectElement>document.getElementById('querySlugs');
  const label = <HTMLSelectElement>document.getElementById('queryDescription');
  input = <HTMLInputElement>document.getElementById('queryPath');
  const requestButton = <HTMLButtonElement>(
    document.getElementById('requestButton')
  );
  const clearButton = <HTMLButtonElement>document.getElementById('clearButton');
  const runTestsButton = <HTMLButtonElement>(
    document.getElementById('runTestsButton')
  );
  pre = <HTMLPreElement>document.getElementById('response');

  queries.forEach((query, i) => {
    var option = document.createElement('option');
    option.innerText = query.slug;
    option.style.color = getQueryStatusColor(query.status);
    select.appendChild(option);
  });

  setValuesToSelectedQueryPath();

  function setValuesToSelectedQueryPath() {
    const querySlug = select.options[select.selectedIndex].innerText;
    const query = queries.find((x) => x.slug === querySlug);
    label.hidden = true;
    if (query.status || query.description) {
      label.hidden = false;
      label.innerText = `${query.status || ''}${
        query.description ? ' - ' + query.description : ''
      }`;
    }
    input.value = query.path;
    pre.innerText = '';
  }

  function clearResponseAndConsole() {
    pre.innerText = '';
    console.clear();
  }

  function setValuesToCustomQuery() {
    select.selectedIndex = -1;
    label.hidden = false;
    label.innerText = 'Custom query';
  }

  fromEvent(select, 'change')
    .pipe(map(() => setValuesToSelectedQueryPath()))
    .subscribe();

  fromEvent(input, 'keydown').pipe(map(setValuesToCustomQuery)).subscribe();

  requestButtonClick$ = fromEvent(requestButton, 'click');

  fromEvent(clearButton, 'click')
    .pipe(map(clearResponseAndConsole))
    .subscribe();

  fromEvent(runTestsButton, 'click').pipe(map(runTests)).subscribe();
}

function runTests() {
  testService.getTestResults().subscribe((allResults) => {
    const allErrors = allResults.filter((x) => !x.isSuccess);

    if (allErrors.length === 0) {
      pre.innerText = 'No test errors';
      return;
    }

    const allErrors_critical = allErrors.filter((x) => !x.status);
    const allErrors_toDo = allErrors.filter((x) => x.status === 'TODO');
    const allErrors_wip = allErrors.filter((x) => x.status === 'WIP');
    const testStatus =
      allErrors_critical.length > 0
        ? 'R'
        : allErrors_wip.length > 0
        ? 'A'
        : 'G';
    const output = {
      status: testStatus,
      errorCounts: {
        All: allErrors.length,
        'Critical (R)': allErrors_critical.length,
        'WIP (A)': allErrors_wip.length,
        'TODO (G)': allErrors_toDo.length,
      },
    };

    pre.innerText = JSON.stringify(output, null, 2);
    console.log('Test errors:', allErrors);
  });
}

function setObservables() {
  const request$ = requestButtonClick$.pipe(map(() => input.value));

  response$ = request$.pipe(
    switchMap((queryPath) => {
      // const moduleData = getModuleDataForQueryPath(queryPath);

      mainModuleService.createStructure();

      return getResponseFromRequest$(queryPath);
    })
  );
}

/* NOTES
  - Concepts to make use of in real backend (and their location in this mockup):
    + testing infrastructure (/tests)
    + query validation
      * json-schema (queries/schemas https://github.com/YousefED/typescript-json-schema)
      * ajv (services/queryService.ts - validateQuery)
    + json api response (interfaces/3rd-party, services/mainService.ts - deriveJsonApi)
  - TODO RR(+JP)
    - spec error responses (with tests - i.e. TDD)
    - response codes
    - meta data (e.g. record/page count - see https://jsonapi.org/examples/#pagination)
    - see rough plan below
    - add sql derivation
    - filter by related entities
  - Rough plan
    + phase 1 - GETs (all use cases, up to depth 2)
    + phase 1b - implement properly on beta (full proof of concept)
    + phase 2 - simple POSTs, PUTs and DELETEs
    + phase 3 - GETs (up to depth N?) [AN working on]
    + phase x - more complex GETs, POSTs, PUTs and DELETEs - as needed
*/
