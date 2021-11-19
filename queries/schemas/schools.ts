// TODO: change any to some jsonschema type
export const schoolQueryObjectSchema: any = {
  $schema: 'http://json-schema.org/draft-04/schema#',
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
        {
          type: 'string',
        },
        {
          type: 'string',
        },
      ],
    },
    fields: {
      type: 'object',
      properties: {
        school: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
          ],
        },
        city: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
          ],
        },
        'city.country': {
          type: 'array',
          items: [
            {
              type: 'string',
            },
            {
              type: 'string',
            },
          ],
        },
      },
      required: ['school', 'city', 'city.country'],
    },
    filter: {
      type: 'object',
      properties: {
        city: {
          type: 'object',
          properties: {
            id: {
              type: 'array',
              items: [
                {
                  type: 'integer',
                },
                {
                  type: 'integer',
                },
              ],
            },
          },
          required: ['id'],
        },
      },
      required: ['city'],
    },
  },
  required: ['type', 'include', 'fields', 'filter'],
};
