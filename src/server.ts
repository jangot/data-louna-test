import dotenv from 'dotenv';

import { createServer } from 'http';
import { app } from './app';
import { serviceRegister } from './service-register';

dotenv.config();

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = createServer(app);

async function initServices() {
  for (const service of Object.values(serviceRegister)) {
    await service.init();
  }
}

async function closeServices() {
  for (const service of Object.values(serviceRegister)) {
    await service.destroy();
  }
}

function shutdown() {
  console.log('finish server and services');
  server.close(async () => {
    console.log('HTTP-server was stopped');
    await closeServices();
    console.log('Services were stopped');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', async () => {
  await closeServices();
  console.log('Application finished');
});

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  console.log('Listening on ' + bind);
}

(async () => {
  await initServices();

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
})()
