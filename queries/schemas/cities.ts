import { JSONSchema7 } from 'json-schema';

//  derived locally using:
// typescript-json-schema "interfaces/queries.ts" CityQueryObject --noExtraProps
export const cityQueryObjectSchema: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  additionalProperties: false,
  definitions: {
    EntityName: {
      enum: ['academicSystem', 'city', 'country', 'school'],
      type: 'string',
    },
    FilterOperator: {
      additionalProperties: false,
      properties: {
        gt: {
          type: 'number',
        },
        gte: {
          type: 'number',
        },
        in: {
          anyOf: [
            {
              items: {
                type: 'string',
              },
              type: 'array',
            },
            {
              items: {
                type: 'number',
              },
              type: 'array',
            },
            {
              items: {
                type: 'boolean',
              },
              type: 'array',
            },
          ],
        },
        lt: {
          type: 'number',
        },
        lte: {
          type: 'number',
        },
        matches: {
          type: 'string',
        },
      },
      type: 'object',
    },
    QueryObjectPage: {
      additionalProperties: false,
      properties: {
        number: {
          type: 'number',
        },
        size: {
          type: 'number',
        },
      },
      type: 'object',
    },
  },
  properties: {
    fields: {
      additionalProperties: false,
      properties: {
        city: {
          items: {
            enum: ['id', 'imageUrl', 'name', 'slug'],
            type: 'string',
          },
          type: 'array',
        },
        country: {
          items: {
            enum: ['id', 'name', 'slug'],
            type: 'string',
          },
          type: 'array',
        },
      },
      type: 'object',
    },
    filter: {
      additionalProperties: false,
      properties: {
        id: {
          $ref: '#/definitions/FilterOperator',
        },
        imageUrl: {
          $ref: '#/definitions/FilterOperator',
        },
        name: {
          $ref: '#/definitions/FilterOperator',
        },
        slug: {
          $ref: '#/definitions/FilterOperator',
        },
      },
      type: 'object',
    },
    include: {
      items: {
        type: 'string',
      },
      type: 'array',
    },
    page: {
      $ref: '#/definitions/QueryObjectPage',
    },
    schema: {
      type: 'string',
    },
    sort: {
      items: {
        enum: [
          '-country.id',
          '-country.name',
          '-country.slug',
          '-id',
          '-imageUrl',
          '-name',
          '-slug',
          'country.id',
          'country.name',
          'country.slug',
          'id',
          'imageUrl',
          'name',
          'slug',
        ],
        type: 'string',
      },
      type: 'array',
    },
    type: {
      $ref: '#/definitions/EntityName',
    },
  },
  type: 'object',
};
