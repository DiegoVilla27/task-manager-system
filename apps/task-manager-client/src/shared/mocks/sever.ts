import { setupServer } from 'msw/node';
import handlersMockHttp from './handlers';

const server = setupServer(...handlersMockHttp);

export default server;
