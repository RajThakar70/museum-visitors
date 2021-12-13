import { FastifyInstance, FastifyError } from 'fastify';

import MuseumRoutes from './museum';


const serverRoutes = [ ...MuseumRoutes ];

export default class Route {
  public static addRoutes(
    server: FastifyInstance,
    options: any,
    callback: (error?: FastifyError) => void
  ) {
    serverRoutes.forEach((routeJSON) => {
      server.route(routeJSON);
    });
    callback();
  }
}
