import { JSONSchema7 } from 'json-schema';

export const cityQueryObjectSchema: JSONSchema7 = {
  // $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    include: {
      type: 'array',
      items: [
        {
          type: 'string',
        },
      ],
      minItems: 1,
      maxItems: 1,
    },
    fields: {
      type: 'object',
      properties: {
        city: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
          ],
          minItems: 1,
          maxItems: 1,
        },
        country: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
          ],
          minItems: 1,
          maxItems: 1,
        },
      },
      required: [],
      additionalProperties: false,
    },
    filter: {
      type: 'object',
      properties: {
        id: {
          type: 'object',
          properties: {
            in: {
              type: 'array',
              items: [
                {
                  type: 'integer',
                },
              ],
              minItems: 1,
              maxItems: 1,
            },
          },
        },
      },
      required: ['id'],
    },
  },
  required: ['type'],
  additionalProperties: false,
};
