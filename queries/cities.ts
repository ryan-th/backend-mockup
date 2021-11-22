import { Query } from '../interfaces/queries';

export function getCityQueries(): Query[] {
  return queries;
}

const queries: Query[] = [
  {
    slug: 'cities-allParams',
    path: '/cities?fields[city]=foo,bar,baz&fields[city.country]=foo&sort=foo,-bar&page[size]=2&filter[name][matches]=li&filter[id]=2,23&filter[hasBeenVisitedByTh]=true',
    status: 'TODO',
    description: 'add test, improve error handling',
  },
  {
    slug: 'cities-customFields',
    path: '/cities?fields[city]=imageUrl',
    status: 'Done',
  },
  {
    slug: 'cities-filterById',
    path: '/cities?fields[city]=name,slug&filter[id]=2,23',
    status: 'Done',
  },
  {
    slug: 'cities-getById',
    path: '/cities/2',
    status: 'Done',
  },
  {
    slug: 'cities-includeCountry',
    path: '/cities?fields[city]=name&include=country&fields[country]=slug&filter[id]=1,2',
    status: 'Done',
  },
  {
    slug: 'cities-inPortugal',
    path: '/cities?include=country&filter[country.name]=Portugal',
    status: 'WIP',
  },
  {
    slug: 'cities-nameMatch',
    path: '/cities?fields[city]=name,slug&filter[name][matches]=li',
    status: 'Done',
  },
  {
    slug: 'cities-noParams',
    path: '/cities',
    status: 'Done',
  },
  {
    slug: 'cities-page1',
    path: '/cities?page[size]=2&page[number]=1',
    status: 'Done',
  },
  {
    slug: 'cities-page2',
    path: '/cities?page[size]=2&page[number]=2',
    status: 'Done',
  },
  {
    slug: 'cities-sortByName',
    path: '/cities?sort=name',
    status: 'Done',
  },
  {
    slug: 'cities-sortByNameDesc',
    path: '/cities?sort=-name',
    status: 'Done',
  },
];

/* filtering notes and ideas
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
    
    // cities in regions which have a population of more than 1B
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
