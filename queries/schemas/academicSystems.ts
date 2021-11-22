import { JSONSchema7 } from 'json-schema';

export const academicSystemQueryObjectSchema: JSONSchema7 = {
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
        academicSystem: {
          items: {
            enum: ['id', 'name'],
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
        name: {
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
        enum: ['-id', '-name', 'id', 'name'],
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
