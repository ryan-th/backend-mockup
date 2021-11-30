import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseTest } from '.';
import { JsonApiDocument } from '../interfaces/responses';
import { getResponseFromRequest$ } from '../services/mainService';

interface Test extends BaseTest {
  inputs: string[];
  expect: JsonApiDocument;
  result?: JsonApiDocument;
  isSuccess?: boolean;
  note?: string;
}

export function getTestResults$(): Observable<Test[]> {
  const tests: Test[] = [
    {
      inputs: ['/cities'],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
              slug: 'city-slug-1',
            },
          },
          {
            type: 'city',
            id: '2',
            attributes: {
              name: 'Beijing',
              slug: 'city-slug-2',
            },
          },
          {
            type: 'city',
            id: '23',
            attributes: {
              name: 'Cairo',
              slug: 'city-slug-3',
            },
          },
        ],
      },
    },
    {
      inputs: ['/cities?fields[city]=imageUrl'],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              imageUrl: 'city-imageUrl-1',
            },
          },
          {
            type: 'city',
            id: '2',
            attributes: {},
          },
          {
            type: 'city',
            id: '23',
            attributes: {
              imageUrl: 'city-imageUrl-3',
            },
          },
        ],
      },
    },
    {
      inputs: [
        '/cities?fields[city]=name&include=country&fields[country]=slug&filter[id]=1,2',
      ],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
            },
            relationships: {
              country: {
                data: { type: 'country', id: '5' },
              },
            },
          },
          {
            type: 'city',
            id: '2',
            attributes: {
              name: 'Beijing',
            },
            relationships: {
              country: {
                data: { type: 'country', id: '6' },
              },
            },
          },
        ],
        included: [
          {
            type: 'country',
            id: '5',
            attributes: {
              slug: 'country-slug-1',
            },
          },
          {
            type: 'country',
            id: '6',
            attributes: {
              slug: 'country-slug-2',
            },
          },
        ],
      },
    },
    {
      inputs: [
        '/cities?fields[city]=name&include=country&fields[country]=slug&filter[id]=1,2',
      ],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
            },
            relationships: {
              country: {
                data: {
                  type: 'country',
                  id: '5',
                },
              },
            },
          },
          {
            type: 'city',
            id: '2',
            attributes: {
              name: 'Beijing',
            },
            relationships: {
              country: {
                data: {
                  type: 'country',
                  id: '6',
                },
              },
            },
          },
        ],
        included: [
          {
            type: 'country',
            id: '5',
            attributes: {
              slug: 'country-slug-1',
            },
          },
          {
            type: 'country',
            id: '6',
            attributes: {
              slug: 'country-slug-2',
            },
          },
        ],
      },
    },
    {
      inputs: ['/academicSystems?filter[id]=2,4'],
      expect: {
        data: [
          {
            type: 'academicSystem',
            id: '2',
            attributes: {
              name: 'American',
            },
          },
          {
            type: 'academicSystem',
            id: '4',
            attributes: {
              name: 'Indian',
            },
          },
        ],
      },
    },
    {
      inputs: ['/cities?page[size]=2&page[number]=1'],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
              slug: 'city-slug-1',
            },
          },
          {
            type: 'city',
            id: '2',
            attributes: {
              name: 'Beijing',
              slug: 'city-slug-2',
            },
          },
        ],
      },
    },
    {
      inputs: ['/cities?include=country&filter[country.name]=Portugal'],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
              slug: 'city-slug-1',
            },
            relationships: {
              country: {
                data: {
                  type: 'country',
                  id: '5',
                },
              },
            },
          },
        ],
        included: [
          {
            type: 'country',
            id: '5',
            attributes: {
              name: 'Portugal',
              slug: 'country-slug-1',
            },
          },
        ],
      },
    },
    {
      inputs: ['/schools?include=city&filter[id]=2848,1923'],
      expect: {
        data: [
          {
            type: 'school',
            id: '2848',
            attributes: {
              name: 'Academie Laurentienne',
              slug: 'school-slug-1',
            },
            relationships: {
              city: {
                data: {
                  type: 'city',
                  id: '1',
                },
              },
            },
          },
          {
            type: 'school',
            id: '1923',
            attributes: {
              name: 'Bar',
              slug: 'school-slug-3',
            },
            relationships: {
              city: {
                data: {
                  type: 'city',
                  id: '23',
                },
              },
            },
          },
        ],
        included: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
              slug: 'city-slug-1',
            },
          },
          {
            type: 'city',
            id: '23',
            attributes: {
              name: 'Cairo',
              slug: 'city-slug-3',
            },
          },
        ],
      },
    },
    {
      inputs: [
        '/schoolAcademicSystems?filter[schoolId]=1&include=academicSystems',
      ],
      expect: {
        data: [
          {
            type: 'schoolAcademicSystem',
            id: '7',
            relationships: {
              academicSystems: {
                data: [
                  {
                    type: 'academicSystem',
                    id: '2',
                  },
                ],
              },
            },
          },
          {
            type: 'schoolAcademicSystem',
            id: '8',
            relationships: {
              academicSystems: {
                data: [
                  {
                    type: 'academicSystem',
                    id: '4',
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: 'academicSystem',
            id: '2',
            attributes: {
              name: 'American',
            },
          },
          {
            type: 'academicSystem',
            id: '4',
            attributes: {
              name: 'Indian',
            },
          },
        ],
      },
    },
    {
      inputs: ['/cities/1?include=country,country.region'],
      expect: {
        data: [
          {
            type: 'city',
            id: '1',
            attributes: {
              name: 'Lisbon',
              slug: 'city-slug-1',
            },
            relationships: {
              country: {
                data: {
                  type: 'country',
                  id: '5',
                },
              },
            },
          },
        ],
        included: [
          {
            type: 'country',
            id: '5',
            attributes: {
              name: 'Portugal',
              slug: 'country-slug-1',
            },
            relationships: {
              region: {
                data: {
                  type: 'region',
                  id: '3',
                },
              },
            },
          },
          {
            type: 'region',
            id: '3',
            attributes: {
              name: 'Europe',
              slug: 'europe',
            },
          },
        ],
      },
    },
    // {
    //   inputs: ['/cities'],
    //   expect: {},
    // },

    // TODO: add more tests
  ];

  const checkResult = (test: Test, result: JsonApiDocument): Test => {
    test.functionName = 'getResponseFromRequest$';
    test.result = <JsonApiDocument>result;
    const strResult = JSON.stringify(test.result);
    const strExpect = JSON.stringify(test.expect);
    test.isSuccess = strResult === strExpect;
    if (!test.isSuccess) {
      console.log('input: ', test.inputs[0]);
      console.log('expect: ', strExpect);
      console.log('result: ', strResult);
    }

    return test;
  };

  const tests$: Observable<any>[] = tests.map((test) => {
    return getResponseFromRequest$
      .call(this, ...test.inputs)
      .pipe(map((result: JsonApiDocument) => checkResult(test, result)));
  });

  const results$ = combineLatest(tests$);

  return results$;
}
