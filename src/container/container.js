import { createContainer, asClass, asFunction, asValue, Lifetime } from 'awilix';

// setting container app
import pkg from '../../package.json';
import config from './config';
import server from './server';
import routes from '../routes/index';
import HttpClient from '../proxies/httpClient';

const container = createContainer();
container.register({
  pkg: asValue(pkg),
  config: asValue(config),
  HttpClient: asValue(HttpClient),
  server: asClass(server).singleton(),
  routes: asFunction(routes).singleton(),
});

container.loadModules([['repositories/models/**/*.model.js', { register: asValue }]], {
  cwd: `${__dirname}/..`,
  formatName: 'camelCase',
});

container.loadModules(['repositories/**/*.repository.js', 'services/**/*.service.js', 'controllers/**/*.controller.js', 'routes/**/*.routes.js'], {
  cwd: `${__dirname}/..`,
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
  },
});

container.loadModules(['proxies/**/*.proxy.js'], {
  cwd: `${__dirname}/..`,
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
    register: asClass,
  },
});

export default container;
