import { HTTPMethods } from 'fastify';
import { GetMuseumVisitors } from './get-museum-visitors';


export default [
  {
    method: 'GET' as HTTPMethods,
    url: '/api/visitors',
    handler: GetMuseumVisitors.perform,
  },
];
