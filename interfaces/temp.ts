import * as JSONAPI from './jsonapi-typescript';

let doc: JSONAPI.Document = {
  errors: [{ id: 123, code: 'foo-bar', detail: '' }],
  meta: {
    schema: 'admin',
  },
  data: {
    type: 'articles',
    id: '1',
  },
};
