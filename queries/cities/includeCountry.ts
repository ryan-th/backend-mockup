import { CityQueryObject, Query } from '../../interfaces/queries';

const queryObject: CityQueryObject = {
  type: 'city',
  include: ['country'],
  fields: {
    city: ['name'],
    country: ['slug'],
  },
  filter: {
    id: [1, 2],
    /*
    // cities in Portugal or China
    country: {
      id: [2,5]
    }

    // cities in countries which begin with 'P'
    country: {
      name: {
        matches: 'P'
      }
    }

    // cities in regions which begin with 'P'
    country: {
      region: {
        name: {
          matches: 'P'
        }
      }
    }
    
    // cities in regions which a population of more than 1B
    country: {
      region: {
        population: {
          gt: 1000000000
        }
      }
    }
    
    // cities with school names which begin with 'P'
    // TODO: consider whether this is a requirement (i.e. going 'the other way' with relationships)
    school: {
      name: {
        matches: 'P'
      }
    }
*/
  },
};

/*
path: `/cities?fields[city]=name&include=country&fields[country]=slug&filter[id]=1,2
  &filter[country.id]=2,5 // cities in Portugal or China
  &filter[country.name][matches]=P // cities in countries which begin with 'P'  
  &filter[country.region.name][matches]=P // cities in regions which begin with 'P'
  &filter[country.region.population][gt]=1000000000 // cities in regions which a population of more than 1B
  &filter[school.name][matches]=P // cities with school names which begin with 'P'
`,
*/

/*
/cities?fields[city]=name&include=country&fields[country]=slug&filter[id]=1,2&filter[country.id]=2,5&filter[country.name][matches]=P&filter[country.region.name][matches]=P&filter[country.region.population][gt]=1000000000&filter[school.name][matches]=P
*/

export const query: Query = {
  slug: 'cities-includeCountry',
  path: '/cities?fields[city]=name&include=country&fields[country]=slug&filter[id]=1,2',
  object: queryObject,
};
