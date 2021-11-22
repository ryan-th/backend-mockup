import { fromEvent, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { queries } from './queries/index';
import { runTests } from './tests';
import { getResponseFromRequest$ } from './services/mainService';

let input: HTMLInputElement;
let pre: HTMLPreElement;
let requestButtonClick$: Observable<Event>;
let response$: Observable<any>;

(function main() {
  // TEMP
  runTests();

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
  pre = <HTMLPreElement>document.getElementById('response');

  queries.forEach((query, i) => {
    var option = document.createElement('option');
    option.innerText = query.slug;
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
}

function setObservables() {
  const request$ = requestButtonClick$.pipe(map(() => input.value));

  response$ = request$.pipe(
    switchMap((queryPath) => getResponseFromRequest$(queryPath))
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
