import fastify, { FastifyInstance, FastifyLoggerOptions } from 'fastify';
import fp from 'fastify-plugin';
import oas from 'fastify-oas';
import middie from 'middie';

import Locals from './Locals';
import ErrorHandler from '../exceptions/ErrorHandler';
import Middleware from './Middleware';
import Decorator from './Decorator';
import Route from '../../routes';
import { promisify } from 'util';

class FastifyApp {
  public fastifyServer: FastifyInstance;

  constructor() {
    this.fastifyServer = fastify({
      ignoreTrailingSlash: true,
      maxParamLength: Locals.config().maxParameterLimit,
      bodyLimit: parseInt(Locals.config().maxUploadLimit),
      logger: {
        level: 'info',
        file: 'server.log',
      },
    });
    (async () => {
      this.mountDecorators();
      await this.registerPlugins();
      this.registerMiddleware();
      this.registerDocumentation();
      this.registerRoutes();
    })();
  }

  private mountDecorators(): void {
    this.fastifyServer = Locals.init(this.fastifyServer);
    this.fastifyServer = Decorator.init(this.fastifyServer);
  }

  private async registerPlugins(): Promise<void> {
    this.fastifyServer.register(fp(ErrorHandler.notFoundHandler));
    this.fastifyServer.register(fp(ErrorHandler.unexpectedErrorHandler));
    // keep this
    await this.fastifyServer.register(middie);
  }

  private registerMiddleware(): void {
    // to avoid race condition
    setTimeout(() => {
      this.fastifyServer = Middleware.mount(this.fastifyServer);
    });
  }

  private registerRoutes(): void {
    this.fastifyServer.register(fp(Route.addRoutes));
  }

  private registerDocumentation(): void {
    this.fastifyServer.register(oas, {
      routePrefix: '/documentation',
      swagger: {
        host: 'localhost:5000',
        info: {
          title: 'Interview APIs',
          description: 'Available apis ',
          version: '1.0.0',
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here',
        },
        consumes: ['application/json'],
        produces: ['application/json'],
      },
      exposeRoute: true,
    });
  }

  async init() {
    console.log('initializing app');
    try {
      await promisify(this.fastifyServer.listen).bind(this.fastifyServer)(
        Locals.config().port,
        '0.0.0.0'
      );
      console.log(this.fastifyServer.printRoutes());
    } catch (error) {
      console.log('err', error);
      this.fastifyServer.log.error(error);
      process.exit(1);
    }
  }
}

export default new FastifyApp();
