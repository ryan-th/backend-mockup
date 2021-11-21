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
    if (query.description) {
      label.hidden = false;
      label.innerText = query.description;
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
